import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button, Heading } from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type { FigmaMessages, Notification } from '../types';
import './app.css';
import { ExportView, type Progress } from './export-view';
import { FinishedView } from './finished-view';
import { NotificationsView } from './notifications-view';
import { PasteView } from './paste-view';
import { postToPlugin } from './post-to-plugin';

// One view is shown at a time, each replacing the main area.
type View = 'paste' | 'exporting' | 'finished' | 'notifications';

type UiState = {
  view: View;
  progress: Progress | null;
  /** The last export's outcome, shown in the finished view. */
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
  | { type: 'export-started' }
  | { type: 'export-progress'; progress: Progress }
  | {
      type: 'export-finished';
      result: NonNullable<UiState['result']>;
      notifications: Notification[];
    }
  | { type: 'show-notifications' }
  | { type: 'go-back' };

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'export-started':
      return {
        ...state,
        view: 'exporting',
        progress: null,
        result: null,
        notifications: [],
      };
    case 'export-progress':
      return { ...state, progress: action.progress };
    case 'export-finished':
      return {
        ...state,
        // A failed export has nothing to show in the finished view, so go straight to what went wrong.
        view: action.result.status === 'success' ? 'finished' : 'notifications',
        progress: null,
        result: action.result,
        notifications: action.notifications,
      };
    case 'show-notifications':
      return { ...state, view: 'notifications' };
    case 'go-back':
      // From notifications, go back to the finished view after a successful export, otherwise to the config.
      return {
        ...state,
        view:
          state.view === 'notifications' && state.result?.status === 'success'
            ? 'finished'
            : 'paste',
      };
  }
}

/** Turns an export result into notifications: the error, the warnings, and the export log. */
function toNotifications(
  msg: Extract<FigmaMessages, { type: 'export-result' }>,
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
            text: `Log (${info.length})`,
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
        case 'export-progress':
          dispatch({
            type: 'export-progress',
            progress: { step: msg.step, total: msg.total, label: msg.label },
          });
          break;
        case 'export-result':
          dispatch({
            type: 'export-finished',
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

  const exportConfig = () => {
    dispatch({ type: 'export-started' });
    postToPlugin('export-config-to-figma', { config: pastedConfig });
  };

  // The number of warning entries. Not the number of affected items: some entries summarise several.
  const warningCount =
    state.notifications.find((n) => n.kind === 'warning')?.details?.length ?? 0;

  return (
    <div className='app'>
      <header>
        <Heading>Create Figma variables</Heading>
      </header>

      <main>
        {state.view === 'paste' && (
          <PasteView value={pastedConfig} onChange={setPastedConfig} />
        )}
        {state.view === 'exporting' && <ExportView progress={state.progress} />}
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
          `${state.result.status === 'success' ? 'Variables created' : 'Could not create variables'}. ${state.result.message}`}
      </div>
      <footer>
        <div className='footer-left'>
          {state.view === 'notifications' && (
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
              Use another config
            </Button>
          )}
        </div>
        <div className='footer-right'>
          {state.view === 'paste' && (
            <Button onClick={exportConfig} disabled={!pastedConfig.trim()}>
              Create variables
            </Button>
          )}
          {state.view === 'finished' && state.notifications.length > 0 && (
            <Button
              onClick={() => dispatch({ type: 'show-notifications' })}
              variant='secondary'
            >
              Show notifications
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
