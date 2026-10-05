import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button, Heading } from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type { FigmaMessages, Notification } from '../types';
import './app.css';
import { postToPlugin } from './post-to-plugin';
import { AboutView } from './views/about';
import { FinishedView } from './views/finished';
import { NotificationsView } from './views/notifications';
import { PasteView } from './views/paste';
import { type Progress, SyncView } from './views/sync';

// One view is shown at a time, each replacing the main area.
type View = 'paste' | 'about' | 'syncing' | 'finished' | 'notifications';

type UiState = {
  view: View;
  progress: Progress | null;
  /** The last sync's outcome, shown in the finished view. */
  result: { status: 'success' | 'error'; message: string } | null;
  notifications: Notification[];
};

const initialState: UiState = {
  view: 'paste',
  progress: null,
  result: null,
  notifications: [],
};

type Action =
  | { type: 'sync-started' }
  | { type: 'sync-progress'; progress: Progress }
  | {
      type: 'sync-finished';
      result: NonNullable<UiState['result']>;
      notifications: Notification[];
    }
  | { type: 'show-notifications' }
  | { type: 'show-about' }
  | { type: 'go-back' };

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'sync-started':
      return {
        ...state,
        view: 'syncing',
        progress: null,
        result: null,
        notifications: [],
      };
    case 'sync-progress':
      return { ...state, progress: action.progress };
    case 'sync-finished':
      return {
        ...state,
        // A failed sync has nothing to show in the finished view, so go straight to what went wrong.
        view: action.result.status === 'success' ? 'finished' : 'notifications',
        progress: null,
        result: action.result,
        notifications: action.notifications,
      };
    case 'show-notifications':
      return { ...state, view: 'notifications' };
    case 'show-about':
      return { ...state, view: 'about' };
    case 'go-back':
      // From notifications, go back to the finished view after a successful sync, otherwise to the config.
      return {
        ...state,
        view:
          state.view === 'notifications' && state.result?.status === 'success'
            ? 'finished'
            : 'paste',
      };
  }
}

/** Turns a sync result into notifications: the error, the warnings, and the sync log. */
function toNotifications(
  msg: Extract<FigmaMessages, { type: 'sync-result' }>,
): Notification[] {
  const warnings = msg.warnings ?? [];
  const info = msg.info ?? [];
  return [
    ...(msg.status === 'error'
      ? [{ kind: 'error' as const, text: msg.message }]
      : []),
    ...(warnings.length > 0
      ? [
          {
            kind: 'warning' as const,
            text: `${warnings.length} ${warnings.length === 1 ? 'warning' : 'warnings'}:`,
            details: warnings,
          },
        ]
      : []),
    ...(info.length > 0
      ? [
          {
            kind: 'info' as const,
            text: `Sync log (${info.length})`,
            details: info,
          },
        ]
      : []),
  ];
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pastedConfig, setPastedConfig] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.figma.com') return;
      const msg = event.data?.pluginMessage as FigmaMessages | undefined;
      if (!msg) return;
      switch (msg.type) {
        case 'sync-progress':
          dispatch({
            type: 'sync-progress',
            progress: { step: msg.step, total: msg.total, label: msg.label },
          });
          break;
        case 'sync-result':
          dispatch({
            type: 'sync-finished',
            result: { status: msg.status, message: msg.message },
            notifications: toNotifications(msg),
          });
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const syncConfig = () => {
    dispatch({ type: 'sync-started' });
    postToPlugin('sync-config-to-figma', { config: pastedConfig });
  };

  // The number of warning entries. Not the number of affected items: some entries summarise several.
  const warningCount =
    state.notifications.find((n) => n.kind === 'warning')?.details?.length ?? 0;

  return (
    <div className='app'>
      <header>
        <Heading>Sync config to Figma</Heading>
      </header>

      <main>
        {state.view === 'paste' && (
          <PasteView value={pastedConfig} onChange={setPastedConfig} />
        )}
        {state.view === 'about' && <AboutView />}
        {state.view === 'syncing' && <SyncView progress={state.progress} />}
        {state.view === 'finished' && state.result && (
          <FinishedView
            message={state.result.message}
            warningCount={warningCount}
          />
        )}
        {state.view === 'notifications' && (
          <NotificationsView notifications={state.notifications} />
        )}
      </main>
      {/* Stays mounted across views, so screen readers announce the outcome when the view changes. */}
      <div className='ds-sr-only' role='status'>
        {state.result &&
          `${state.result.status === 'success' ? 'Sync finished' : 'Sync failed'}. ${state.result.message}`}
      </div>
      <footer>
        <div className='footer-left'>
          {state.view === 'paste' && (
            <Button onClick={syncConfig} disabled={!pastedConfig.trim()}>
              Sync to Figma
            </Button>
          )}
          {(state.view === 'notifications' || state.view === 'about') && (
            <Button
              onClick={() => dispatch({ type: 'go-back' })}
              variant='tertiary'
            >
              Go back
            </Button>
          )}
          {state.view === 'finished' && (
            <Button
              onClick={() => dispatch({ type: 'go-back' })}
              variant='tertiary'
            >
              Sync another config
            </Button>
          )}
        </div>
        <div className='footer-right'>
          {state.view === 'paste' && (
            <Button
              data-color='neutral'
              className='ds-button'
              data-variant='tertiary'
              onClick={() => dispatch({ type: 'show-about' })}
            >
              What does syncing do?
            </Button>
          )}
          {state.view === 'finished' && state.notifications.length > 0 && (
            <Button
              onClick={() => dispatch({ type: 'show-notifications' })}
              data-color='neutral'
              variant='tertiary'
            >
              Show sync log
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
