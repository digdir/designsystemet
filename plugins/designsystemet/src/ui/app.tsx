import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button, Heading } from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type { FigmaMessages, Notification } from '../types';
import './app.css';
import { postToPlugin } from './post-to-plugin';
import { copyText, downloadText } from './save-text';
import { AboutView } from './views/about';
import { type ExtractState, ExtractView } from './views/extract';
import { FinishedView } from './views/finished';
import { HomeView } from './views/home';
import { NotificationsView } from './views/notifications';
import { PasteView } from './views/paste';
import { type Progress, SyncView } from './views/sync';

// One view is shown at a time, each replacing the main area.
type View =
  | 'home'
  | 'paste'
  | 'about'
  | 'syncing'
  | 'finished'
  | 'notifications'
  | 'extract';

type UiState = {
  view: View;
  progress: Progress | null;
  /** The last sync's outcome, shown in the finished view. */
  result: { status: 'success' | 'error'; message: string } | null;
  notifications: Notification[];
  /** The config created from this file, shown in the extract view. */
  extracted: ExtractState | null;
};

const START_VIEW: View = 'paste';

const initialState: UiState = {
  view: START_VIEW,
  progress: null,
  result: null,
  notifications: [],
  extracted: null,
};

type Action =
  | { type: 'sync-started' }
  | { type: 'sync-progress'; progress: Progress }
  | {
      type: 'sync-finished';
      result: NonNullable<UiState['result']>;
      notifications: Notification[];
    }
  | { type: 'show-paste' }
  | { type: 'show-notifications' }
  | { type: 'show-about' }
  | { type: 'extract-started' }
  | { type: 'extract-finished'; extracted: ExtractState }
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
    case 'show-paste':
      return { ...state, view: 'paste' };
    case 'show-notifications':
      return { ...state, view: 'notifications' };
    case 'show-about':
      return { ...state, view: 'about' };
    case 'extract-started':
      return { ...state, view: 'extract', extracted: { status: 'loading' } };
    case 'extract-finished':
      return { ...state, extracted: action.extracted };
    case 'go-back':
      return { ...state, view: previousView(state) };
  }
}

function previousView(state: UiState): View {
  switch (state.view) {
    // The sync views go back to the config, except the log of a successful sync, which goes back to its result.
    case 'about':
    case 'finished':
      return 'paste';
    case 'notifications':
      return state.result?.status === 'success' ? 'finished' : 'paste';
    default:
      return 'home';
  }
}

/** The header title: the flow the current view is part of. */
function viewTitle(view: View): string {
  switch (view) {
    case 'home':
      return 'Designsystemet';
    case 'extract':
      return 'Extract config';
    default:
      return 'Sync config to Figma';
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
  // Feedback on the extract view's copy button.
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed' | null>(
    null,
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.figma.com') return;
      const msg = event.data?.pluginMessage as FigmaMessages | undefined;
      if (!msg) return;
      switch (msg.type) {
        case 'sync-progress':
          dispatch({
            type: 'sync-progress',
            progress: {
              step: msg.step,
              total: msg.total,
              label: msg.label,
              note: msg.note,
            },
          });
          break;
        case 'sync-result':
          dispatch({
            type: 'sync-finished',
            result: { status: msg.status, message: msg.message },
            notifications: toNotifications(msg),
          });
          break;
        case 'extract-config-result':
          dispatch({
            type: 'extract-finished',
            extracted:
              msg.status === 'success' && msg.config
                ? {
                    status: 'success',
                    config: msg.config,
                    warnings: msg.warnings ?? [],
                  }
                : { status: 'error', message: msg.message ?? 'Unknown error' },
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

  const extractConfig = () => {
    setCopyStatus(null);
    dispatch({ type: 'extract-started' });
    postToPlugin('extract-config');
  };

  const extractedConfig =
    state.extracted?.status === 'success' ? state.extracted.config : null;

  // Every view but the start view and a running sync has a way back.
  const canGoBack = state.view !== START_VIEW && state.view !== 'syncing';

  // The number of warning entries. Not the number of affected items: some entries summarise several.
  const warningCount =
    state.notifications.find((n) => n.kind === 'warning')?.details?.length ?? 0;

  return (
    <div className='app'>
      <header>
        <Heading>{viewTitle(state.view)}</Heading>
      </header>

      <main>
        {state.view === 'home' && (
          <HomeView
            onSync={() => dispatch({ type: 'show-paste' })}
            onExtract={extractConfig}
          />
        )}
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
        {state.view === 'extract' && state.extracted && (
          <ExtractView extracted={state.extracted} />
        )}
      </main>
      {/* Stays mounted across views, so screen readers announce the outcome when the view changes. */}
      <div className='ds-sr-only' role='status'>
        {state.result &&
          `${state.result.status === 'success' ? 'Sync finished' : 'Sync failed'}. ${state.result.message}`}
      </div>
      {/* Go back is always on the left, the view's actions on the right. */}
      <footer>
        {canGoBack && (
          <Button
            onClick={() => dispatch({ type: 'go-back' })}
            variant='tertiary'
          >
            {state.view === 'finished' ? 'Sync another config' : 'Go back'}
          </Button>
        )}
        {state.view === 'paste' && (
          <div className='footer-actions'>
            <Button onClick={syncConfig} disabled={!pastedConfig.trim()}>
              Sync to Figma
            </Button>
            <Button
              data-color='neutral'
              variant='tertiary'
              onClick={() => dispatch({ type: 'show-about' })}
            >
              What does syncing do?
            </Button>
          </div>
        )}
        {state.view === 'extract' && extractedConfig && (
          <div className='footer-actions'>
            <Button
              variant='secondary'
              onClick={() =>
                copyText(extractedConfig).then(
                  () => setCopyStatus('copied'),
                  () => setCopyStatus('failed'),
                )
              }
            >
              {copyStatus === 'copied'
                ? 'Copied'
                : copyStatus === 'failed'
                  ? 'Copy failed'
                  : 'Copy'}
            </Button>
            <Button
              onClick={() =>
                downloadText('designsystemet.config.json', extractedConfig)
              }
            >
              Download
            </Button>
          </div>
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
      </footer>
    </div>
  );
}

export default App;
