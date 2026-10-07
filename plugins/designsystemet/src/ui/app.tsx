import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button, Heading } from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type { FigmaMessages, Notification } from '../types';
import './app.css';
import { postToPlugin } from './post-to-plugin';
import { copyText, downloadText } from './save-text';
import { AboutView } from './views/about';
import { type ExportState, ExportView } from './views/export';
import { FinishedView } from './views/finished';
import { HomeView } from './views/home';
import { ImportView } from './views/import';
import { ImportingView, type Progress } from './views/importing';
import { NotificationsView } from './views/notifications';

// One view is shown at a time, each replacing the main area.
type View =
  | 'home'
  | 'import'
  | 'about'
  | 'importing'
  | 'finished'
  | 'notifications'
  | 'export';

type UiState = {
  view: View;
  progress: Progress | null;
  /** The last import's outcome, shown in the finished view. */
  result: { status: 'success' | 'error'; message: string } | null;
  notifications: Notification[];
  /** The config created from this file, shown in the export view. */
  exported: ExportState | null;
};

const START_VIEW: View = 'import';

const initialState: UiState = {
  view: START_VIEW,
  progress: null,
  result: null,
  notifications: [],
  exported: null,
};

type Action =
  | { type: 'import-started' }
  | { type: 'import-progress'; progress: Progress }
  | {
      type: 'import-finished';
      result: NonNullable<UiState['result']>;
      notifications: Notification[];
    }
  | { type: 'show-import' }
  | { type: 'show-notifications' }
  | { type: 'show-about' }
  | { type: 'export-started' }
  | { type: 'export-finished'; exported: ExportState }
  | { type: 'go-back' };

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'import-started':
      return {
        ...state,
        view: 'importing',
        progress: null,
        result: null,
        notifications: [],
      };
    case 'import-progress':
      return { ...state, progress: action.progress };
    case 'import-finished':
      return {
        ...state,
        // A failed import has nothing to show in the finished view, so go straight to what went wrong.
        view: action.result.status === 'success' ? 'finished' : 'notifications',
        progress: null,
        result: action.result,
        notifications: action.notifications,
      };
    case 'show-import':
      return { ...state, view: 'import' };
    case 'show-notifications':
      return { ...state, view: 'notifications' };
    case 'show-about':
      return { ...state, view: 'about' };
    case 'export-started':
      return { ...state, view: 'export', exported: { status: 'loading' } };
    case 'export-finished':
      return { ...state, exported: action.exported };
    case 'go-back':
      return { ...state, view: previousView(state) };
  }
}

function previousView(state: UiState): View {
  switch (state.view) {
    // The import views go back to the config, except the log of a successful import, which goes back to its result.
    case 'about':
    case 'finished':
      return 'import';
    case 'notifications':
      return state.result?.status === 'success' ? 'finished' : 'import';
    default:
      return 'home';
  }
}

/** The header title: the flow the current view is part of. */
function viewTitle(view: View): string {
  switch (view) {
    case 'home':
      return 'Designsystemet';
    case 'export':
      return 'Export';
    default:
      return 'Import';
  }
}

/** Turns an import result into notifications: the error, the warnings, and the import log. */
function toNotifications(
  msg: Extract<FigmaMessages, { type: 'import-result' }>,
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
            text: `Import log (${info.length})`,
            details: info,
          },
        ]
      : []),
  ];
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [configText, setConfigText] = useState('');
  // Feedback on the export view's copy button.
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed' | null>(
    null,
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.figma.com') return;
      const msg = event.data?.pluginMessage as FigmaMessages | undefined;
      if (!msg) return;
      switch (msg.type) {
        case 'import-progress':
          dispatch({
            type: 'import-progress',
            progress: {
              step: msg.step,
              total: msg.total,
              label: msg.label,
              note: msg.note,
            },
          });
          break;
        case 'import-result':
          dispatch({
            type: 'import-finished',
            result: { status: msg.status, message: msg.message },
            notifications: toNotifications(msg),
          });
          break;
        case 'export-config-result':
          dispatch({
            type: 'export-finished',
            exported:
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

  const importConfig = () => {
    dispatch({ type: 'import-started' });
    postToPlugin('import-config', { config: configText });
  };

  const exportConfig = () => {
    setCopyStatus(null);
    dispatch({ type: 'export-started' });
    postToPlugin('export-config');
  };

  const exportedConfig =
    state.exported?.status === 'success' ? state.exported.config : null;

  // Every view but the start view and a running import has a way back.
  const canGoBack = state.view !== START_VIEW && state.view !== 'importing';

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
            onImport={() => dispatch({ type: 'show-import' })}
            onExport={exportConfig}
          />
        )}
        {state.view === 'import' && (
          <ImportView value={configText} onChange={setConfigText} />
        )}
        {state.view === 'about' && <AboutView />}
        {state.view === 'importing' && (
          <ImportingView progress={state.progress} />
        )}
        {state.view === 'finished' && state.result && (
          <FinishedView
            message={state.result.message}
            warningCount={warningCount}
          />
        )}
        {state.view === 'notifications' && (
          <NotificationsView notifications={state.notifications} />
        )}
        {state.view === 'export' && state.exported && (
          <ExportView exported={state.exported} />
        )}
      </main>
      {/* Stays mounted across views, so screen readers announce the outcome when the view changes. */}
      <div className='ds-sr-only' role='status'>
        {state.result &&
          `${state.result.status === 'success' ? 'Import finished' : 'Import failed'}. ${state.result.message}`}
      </div>
      {/* Go back is always on the left, the view's actions on the right. */}
      <footer>
        {canGoBack && (
          <Button
            onClick={() => dispatch({ type: 'go-back' })}
            variant='tertiary'
          >
            {state.view === 'finished' ? 'Import again' : 'Go back'}
          </Button>
        )}
        {state.view === 'import' && (
          <div className='footer-actions'>
            <Button
              data-color='neutral'
              variant='tertiary'
              onClick={() => dispatch({ type: 'show-about' })}
            >
              What does importing do?
            </Button>
            <Button onClick={importConfig} disabled={!configText.trim()}>
              Import
            </Button>
          </div>
        )}
        {state.view === 'export' && exportedConfig && (
          <div className='footer-actions'>
            <Button
              variant='secondary'
              onClick={() =>
                copyText(exportedConfig).then(
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
                downloadText('designsystemet.config.json', exportedConfig)
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
            Show import log
          </Button>
        )}
      </footer>
    </div>
  );
}

export default App;
