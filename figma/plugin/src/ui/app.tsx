import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button, Heading } from '@digdir/designsystemet-react';
import { useEffect, useReducer, useState } from 'react';
import type {
  FigmaMessages,
  MigrationInfo,
  MigrationSummary,
  Notification,
} from '../types';
import './app.css';
import { onPluginMessage, postToPlugin } from './plugin-messages';
import { copyText, downloadText } from './save-text';
import { AboutView } from './views/about';
import { type ExportState, ExportView } from './views/export';
import { FinishedView } from './views/finished';
import { HomeView } from './views/home';
import { ImportView } from './views/import';
import { ImportingView, type Progress } from './views/importing';
import { type MigrationsState, MigrationsView } from './views/migrations';
import { NotificationsView } from './views/notifications';

// One view is shown at a time, each replacing the main area.
type View =
  | 'home'
  | 'import'
  | 'about'
  | 'importing'
  | 'finished'
  | 'notifications'
  | 'export'
  | 'migrations';

type UiState = {
  view: View;
  progress: Progress | null;
  /** The last import's outcome, shown in the finished view. */
  result: { status: 'success' | 'error'; message: string } | null;
  notifications: Notification[];
  /** The config created from this file, shown in the export view. */
  exported: ExportState | null;
  /** Choosing, previewing and applying migrations, in the migrations view. */
  migrations: MigrationsState;
};

const START_VIEW: View = 'home';
// Feature toggle: export, which creates a config from the variables in this file. Turned off for now.
const FEAT_EXPORT = false;
// Feature toggle: stamping the UI kit's source file for migrations, see plugin/stamps/stamps.ts. For maintainers,
// who turn it on in a local build before a release.
const FEAT_STAMP_UI_KIT = true;

const initialState: UiState = {
  view: START_VIEW,
  progress: null,
  result: null,
  notifications: [],
  exported: null,
  migrations: {
    available: null,
    selected: [],
    status: 'select',
    summaries: [],
  },
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
  | { type: 'show-migrations' }
  | { type: 'migrations-listed'; available: MigrationInfo[] }
  | { type: 'migrations-started'; ids: string[]; dryRun: boolean }
  | {
      type: 'migrations-finished';
      dryRun: boolean;
      summaries: MigrationSummary[];
      savedVersion?: string;
      error?: string;
    }
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
    case 'show-migrations':
      return {
        ...state,
        view: 'migrations',
        migrations: initialState.migrations,
      };
    case 'migrations-listed':
      return {
        ...state,
        migrations: {
          ...state.migrations,
          available: action.available,
        },
      };
    case 'migrations-started':
      return {
        ...state,
        migrations: {
          ...state.migrations,
          selected: action.ids,
          status: action.dryRun ? 'previewing' : 'running',
          error: undefined,
        },
      };
    case 'migrations-finished':
      return {
        ...state,
        migrations: {
          ...state.migrations,
          // A failure goes back to choosing, with the error shown there.
          status: action.error ? 'select' : action.dryRun ? 'preview' : 'done',
          summaries: action.summaries,
          savedVersion: action.savedVersion,
          error: action.error,
        },
      };
    case 'go-back':
      // From the preview, go back to choosing migrations. From the result, go back to the start.
      if (
        state.view === 'migrations' &&
        state.migrations.status === 'preview'
      ) {
        return {
          ...state,
          migrations: { ...state.migrations, status: 'select' },
        };
      }
      return { ...state, view: previousView(state) };
  }
}

function previousView(state: UiState): View {
  switch (state.view) {
    // The import views go back to the config, except the log of a successful import, which goes back to its result.
    case 'about':
      return 'import';
    // A finished import or migration goes back to the start.
    case 'finished':
    case 'migrations':
      return START_VIEW;
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
    case 'migrations':
      return 'Update UI kit';
    default:
      return 'Import';
  }
}

/** Turns an import result into notifications: the error, the warnings, the import log, and the timings. */
function toNotifications(
  msg: Extract<FigmaMessages, { type: 'import-result' }>,
): Notification[] {
  const warnings = msg.warnings ?? [];
  const info = msg.info ?? [];
  const timings = msg.timings ?? [];
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
    ...(timings.length > 0
      ? [{ kind: 'info' as const, text: 'Timings', details: timings }]
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
  // Whether the UI kit is being stamped, for the spinner on its card. The result is shown with figma.notify.
  const [stamping, setStamping] = useState(false);
  // How many pages in this file are stamped, shown on the Stamp UI kit card. Null until the plugin says.
  const [stampedPages, setStampedPages] = useState<number | null>(null);

  useEffect(() => {
    const stopListening = onPluginMessage((msg) => {
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
        case 'stamp-status':
          setStamping(false);
          setStampedPages(msg.stampedPages);
          break;
        case 'migrations-list':
          dispatch({ type: 'migrations-listed', available: msg.migrations });
          break;
        case 'migrations-result':
          dispatch({
            type: 'migrations-finished',
            dryRun: msg.dryRun,
            summaries: msg.summaries,
            savedVersion: msg.savedVersion,
            error:
              msg.status === 'error'
                ? `Could not ${msg.dryRun ? 'preview' : 'apply'} the migrations: ${msg.message ?? 'Unknown error'}`
                : undefined,
          });
          // Applied migrations are recorded in the file, so list them again to show when they were applied.
          if (!msg.dryRun && msg.status === 'success') {
            postToPlugin('list-migrations');
          }
          break;
      }
    });
    // For the home view's badge: how many migrations this file hasn't had yet.
    postToPlugin('list-migrations');
    if (FEAT_STAMP_UI_KIT) postToPlugin('get-stamp-status');

    return stopListening;
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

  const stampUiKit = () => {
    if (stamping) return;
    setStamping(true);
    postToPlugin('stamp-ui-kit');
  };

  const showMigrations = () => {
    dispatch({ type: 'show-migrations' });
    postToPlugin('list-migrations');
  };

  // Previews the chosen migrations, or applies the ones that were previewed.
  const runMigrations = (ids: string[], dryRun: boolean) => {
    dispatch({ type: 'migrations-started', ids, dryRun });
    postToPlugin('run-migrations', { ids, dryRun });
  };

  // Something to apply: a previewed migration that can run and has changes.
  const canApply = state.migrations.summaries.some(
    (summary) => !summary.error && summary.total > 0,
  );

  // Migrations not applied to this file yet, for the badge on the Update UI kit card. Only in a file with the
  // UI kit's pages, as other files have nothing to migrate.
  const pendingMigrations =
    state.migrations.available?.filter((m) => m.inFile && !m.appliedAt)
      .length ?? 0;

  const exportedConfig =
    state.exported?.status === 'success' ? state.exported.config : null;

  // A finished import or applied migrations: the way back goes to the start view.
  const backToStart =
    state.view === 'finished' ||
    (state.view === 'migrations' && state.migrations.status === 'done');

  // Every view but the start view and a running import has a way back.
  const canGoBack =
    state.view !== START_VIEW &&
    state.view !== 'importing' &&
    !(
      state.view === 'migrations' &&
      (state.migrations.status === 'previewing' ||
        state.migrations.status === 'running')
    );

  // The number of warning entries. Not the number of affected items: some entries summarise several.
  const warningCount =
    state.notifications.find((n) => n.kind === 'warning')?.details?.length ?? 0;

  return (
    <div className='app'>
      {/* The home view has its own title. */}
      {START_VIEW === 'home' && state.view !== 'home' ? (
        <header>
          <Heading>{viewTitle(state.view)}</Heading>
        </header>
      ) : (
        <span></span> // to keep the layout consistent
      )}
      <main>
        {state.view === 'home' && (
          <HomeView
            onImport={() => dispatch({ type: 'show-import' })}
            onUpdateKit={showMigrations}
            pendingMigrations={pendingMigrations}
            onExport={FEAT_EXPORT ? exportConfig : undefined}
            onStampUiKit={FEAT_STAMP_UI_KIT ? stampUiKit : undefined}
            stamping={stamping}
            stampedPages={stampedPages}
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
        {state.view === 'migrations' && (
          <MigrationsView
            state={state.migrations}
            onChoose={(id) => runMigrations([id], true)}
          />
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
            data-color='accent'
            onClick={() => dispatch({ type: 'go-back' })}
            variant='tertiary'
          >
            {backToStart ? 'Back to start' : 'Go back'}
          </Button>
        )}
        {state.view === 'import' && (
          <div className='footer-actions'>
            {START_VIEW === 'import' ? (
              <>
                <Button
                  data-color='accent'
                  onClick={importConfig}
                  disabled={!configText.trim()}
                >
                  Import
                </Button>
                <Button
                  variant='tertiary'
                  onClick={() => dispatch({ type: 'show-about' })}
                >
                  What does importing do?
                </Button>
                <Button variant='tertiary' onClick={showMigrations}>
                  Update UI kit
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='tertiary'
                  onClick={() => dispatch({ type: 'show-about' })}
                >
                  What does importing do?
                </Button>
                <Button
                  data-color='accent'
                  onClick={importConfig}
                  disabled={!configText.trim()}
                >
                  Import
                </Button>
              </>
            )}
          </div>
        )}
        {state.view === 'export' && exportedConfig && (
          <div className='footer-actions'>
            <Button
              data-color='accent'
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
              data-color='accent'
              onClick={() =>
                downloadText('designsystemet.config.json', exportedConfig)
              }
            >
              Download
            </Button>
          </div>
        )}
        {state.view === 'migrations' &&
          state.migrations.status === 'preview' && (
            <Button
              data-color='accent'
              onClick={() => runMigrations(state.migrations.selected, false)}
              disabled={!canApply}
            >
              Apply changes
            </Button>
          )}
        {state.view === 'finished' && state.notifications.length > 0 && (
          <Button
            onClick={() => dispatch({ type: 'show-notifications' })}
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
