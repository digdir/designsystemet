import { Alert, Button, Field, Heading, Label, Spinner, Textarea } from '@digdir/designsystemet-react'
import { useEffect, useReducer, useState } from 'react'
import type { ModuleBridge } from '../../ui/shell'
import {
  buildPreviewFromConfigText,
  isLegacyColorConfig,
  legacyColorMigrationCopy,
  migrateLegacyColorConfig,
} from './config-generator'
import { PreviewView } from './PreviewView'
import type {
  Notification,
  PreviewData,
  SerializedPreviewData,
  UiState,
  VariableStructureStatus,
} from './types'

const MIGRATION_GUIDE_URL = 'https://designsystemet.no/en/blog/migrate-simpler-color'

type View = 'prepare' | 'ambiguous' | 'migrate' | 'preview' | 'paste'

const initialState: UiState = {
  preview: null,
  selectedTheme: null,
  selectedScheme: null,
  isImporting: false,
  pendingLegacyConfig: null,
  variableStructure: null,
  isPreparingVariables: false,
  notification: null,
}

type Action =
  | { type: 'set-preview'; preview: PreviewData; theme: string | null; scheme: string | null; notification: Notification | null }
  | { type: 'clear-preview' }
  | { type: 'set-pending-legacy'; text: string }
  | { type: 'clear-pending'; notification: Notification | null }
  | { type: 'set-importing'; value: boolean }
  | { type: 'set-preparing'; value: boolean }
  | { type: 'set-variable-structure'; status: VariableStructureStatus | null }
  | { type: 'set-notification'; notification: Notification | null }
  | { type: 'select-theme'; theme: string }
  | { type: 'select-scheme'; scheme: string }

function reducer(state: UiState, action: Action): UiState {
  switch (action.type) {
    case 'set-preview':
      return {
        ...state,
        preview: action.preview,
        selectedTheme: action.theme,
        selectedScheme: action.scheme,
        notification: action.notification,
      }
    case 'clear-preview':
      return { ...state, preview: null, notification: null }
    case 'set-pending-legacy':
      return { ...state, pendingLegacyConfig: action.text, notification: null }
    case 'clear-pending':
      return { ...state, pendingLegacyConfig: null, notification: action.notification }
    case 'set-importing':
      return { ...state, isImporting: action.value, notification: action.value ? null : state.notification }
    case 'set-preparing':
      return { ...state, isPreparingVariables: action.value }
    case 'set-variable-structure':
      return { ...state, variableStructure: action.status }
    case 'set-notification':
      return { ...state, notification: action.notification }
    case 'select-theme':
      return { ...state, selectedTheme: action.theme }
    case 'select-scheme':
      return { ...state, selectedScheme: action.scheme }
  }
}

function computeView(state: UiState): View {
  if (state.variableStructure?.state === 'ambiguous') {
    return 'ambiguous'
  }
  if (state.variableStructure?.state === 'needs-prepare') {
    return 'prepare'
  }
  if (state.pendingLegacyConfig) {
    return 'migrate'
  }
  if (state.preview) {
    return 'preview'
  }
  return 'paste'
}

export function TokenExport({ bridge }: { bridge: ModuleBridge }): React.JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [configText, setConfigText] = useState('')
  const view = computeView(state)

  // Ask the plugin code to inspect the file's color variable structure so we can gate
  // import behind preparation when the old Main/Support color structure is present.
  useEffect(() => {
    bridge.send('check-variable-structure')
  }, [bridge])

  useEffect(() => {
    return bridge.subscribe((message) => {
      switch (message.type) {
        case 'import-success':
          dispatch({ type: 'set-importing', value: false })
          dispatch({ type: 'set-notification', notification: { kind: 'success', text: 'Exported to Figma.' } })
          logMessages('DS Theme Importer', message.logs)
          return
        case 'import-error':
          dispatch({ type: 'set-importing', value: false })
          dispatch({
            type: 'set-notification',
            notification: { kind: 'error', text: (message.message as string) || 'Export failed.' },
          })
          console.error('Import failed', message.message)
          return
        case 'variable-structure-status':
          dispatch({
            type: 'set-variable-structure',
            status: (message.status as VariableStructureStatus) || null,
          })
          return
        case 'prepare-variables-result': {
          dispatch({ type: 'set-preparing', value: false })
          const result = (message.result as { status?: string; message?: string }) || {}
          if (result.status === 'error') {
            dispatch({
              type: 'set-notification',
              notification: { kind: 'error', text: result.message || 'Could not prepare the variables.' },
            })
          } else {
            dispatch({
              type: 'set-notification',
              notification: {
                kind: 'success',
                text:
                  result.status === 'noop'
                    ? 'Variables were already prepared.'
                    : 'Variables prepared. You can now import.',
              },
            })
          }
          return
        }
      }
    })
  }, [bridge])

  async function buildPreview(text: string): Promise<void> {
    try {
      const preview = await buildPreviewFromConfigText(text)
      const theme = preview.themeOptions[0]?.name || null
      // Default to the light scheme when present so the preview opens on a light surface;
      // fall back to the first scheme otherwise.
      const lightScheme = preview.colorSchemeOptions.find((option) => /light/i.test(option.name))
      const scheme = (lightScheme || preview.colorSchemeOptions[0])?.name || null
      dispatch({
        type: 'set-preview',
        preview,
        theme,
        scheme,
        notification:
          preview.warnings.length > 0
            ? {
                kind: 'warning',
                text: `Preview generated with ${preview.warnings.length} warning${preview.warnings.length === 1 ? '' : 's'}.`,
                details: preview.warnings,
              }
            : null,
      })
    } catch (error) {
      console.error('Failed to generate preview from config', error)
      dispatch({
        type: 'set-notification',
        notification: {
          kind: 'error',
          text: error instanceof Error ? error.message : 'Could not generate tokens from config.',
        },
      })
    }
  }

  async function uploadConfig(): Promise<void> {
    if (state.isImporting) {
      return
    }
    const text = configText.trim()
    if (!text) {
      dispatch({ type: 'set-notification', notification: { kind: 'error', text: 'Paste a config first.' } })
      return
    }
    // Detect the removed main/support color categories and ask before migrating, rather than
    // failing on schema validation with a cryptic error. The migration dialog explains it, so
    // no banner is shown alongside it.
    if (isLegacyColorConfig(text)) {
      dispatch({ type: 'set-pending-legacy', text: migrateLegacyColorConfig(text) })
      return
    }
    await buildPreview(text)
  }

  function exportToFigma(): void {
    if (!state.preview || state.isImporting) {
      return
    }
    dispatch({ type: 'set-importing', value: true })
    bridge.send('import-to-figma', {
      preview: serializePreview(state.preview),
      selectedTheme: state.selectedTheme,
      selectedScheme: state.selectedScheme,
    })
  }

  function confirmMigrate(): void {
    const migrated = state.pendingLegacyConfig
    if (!migrated) {
      return
    }
    setConfigText(migrated)
    dispatch({ type: 'clear-pending', notification: null })
    void buildPreview(migrated)
  }

  function prepareVariables(): void {
    if (state.isPreparingVariables) {
      return
    }
    dispatch({ type: 'set-preparing', value: true })
    bridge.send('prepare-variables')
  }

  return (
    <div className="tx-app">
      <header className="tx-header">
        {bridge.canGoHome && (
          <Button variant="tertiary" data-size="sm" onClick={bridge.goHome}>
            ← Go back
          </Button>
        )}
        <Heading level={1} data-size="sm">
          Export theme to Figma
        </Heading>
      </header>

      {state.notification && (
        <Banner
          notification={state.notification}
          onDismiss={() => dispatch({ type: 'set-notification', notification: null })}
        />
      )}

      <main className="tx-content">
        {view === 'paste' && (
          <section className="tx-paste">
            <Field>
              <Label>Paste config file</Label>
              <Textarea
                spellCheck={false}
                placeholder="Paste config here…"
                value={configText}
                onChange={(event) => setConfigText(event.target.value)}
              />
            </Field>
          </section>
        )}

        {view === 'preview' && state.preview && (
          <PreviewView
            preview={state.preview}
            selectedTheme={state.selectedTheme}
            selectedScheme={state.selectedScheme}
            onSelectTheme={(theme) => dispatch({ type: 'select-theme', theme })}
            onSelectScheme={(scheme) => dispatch({ type: 'select-scheme', scheme })}
          />
        )}

        {view === 'prepare' && (
          <PrepareGate
            preparing={state.isPreparingVariables}
            onPrepare={prepareVariables}
            onOpenGuide={() => bridge.openExternal(MIGRATION_GUIDE_URL)}
          />
        )}

        {view === 'ambiguous' && state.variableStructure && (
          <MessageCard heading="Can't prepare automatically" onOpenGuide={() => bridge.openExternal(MIGRATION_GUIDE_URL)}>
            {state.variableStructure.message}
          </MessageCard>
        )}

        {view === 'migrate' && (
          <MigrationPrompt
            onConfirm={confirmMigrate}
            onCancel={() =>
              dispatch({
                type: 'clear-pending',
                notification: { kind: 'info', text: 'Migration cancelled. The config was not changed.' },
              })
            }
          />
        )}
      </main>

      <footer className="tx-footer">
        <div className="tx-footer-left">
          {view === 'preview' && (
            <Button variant="tertiary" onClick={() => dispatch({ type: 'clear-preview' })}>
              Upload new config file
            </Button>
          )}
        </div>
        <div className="tx-footer-right">
          {view === 'paste' && (
            <Button variant="primary" onClick={() => void uploadConfig()}>
              Upload
            </Button>
          )}
          {view === 'preview' && (
            <Button variant="primary" loading={state.isImporting} onClick={exportToFigma}>
              Export to Figma
            </Button>
          )}
        </div>
      </footer>

      {state.isImporting && (
        <div className="tx-overlay" role="status" aria-live="polite">
          <div className="tx-overlay-card">
            <Spinner aria-label="Exporting to Figma…" />
            <span>Exporting to Figma…</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Banner({
  notification,
  onDismiss,
}: {
  notification: Notification
  onDismiss: () => void
}): React.JSX.Element {
  // Notification.kind maps onto Designsystemet severity colors; 'error' is 'danger' there.
  const color = notification.kind === 'error' ? 'danger' : notification.kind
  return (
    <Alert data-color={color} className="tx-banner">
      <div className="tx-banner-body">
        <span>{notification.text}</span>
        {notification.details && notification.details.length > 0 && (
          <ul className="tx-banner-details">
            {notification.details.slice(0, 8).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
      </div>
      <Button variant="tertiary" data-size="sm" icon onClick={onDismiss} aria-label="Dismiss">
        ×
      </Button>
    </Alert>
  )
}

function PrepareGate({
  preparing,
  onPrepare,
  onOpenGuide,
}: {
  preparing: boolean
  onPrepare: () => void
  onOpenGuide: () => void
}): React.JSX.Element {
  return (
    <section className="tx-message">
      <Heading level={2} data-size="xs">
        Old variable structure
      </Heading>
      <p>
        This Figma file uses the old color structure with <code>Main color</code> and{' '}
        <code>Support color</code>. Importing would create a new <code>Color</code> collection
        alongside the old ones and break the file's bindings.
      </p>
      <p>
        Click <strong>Prepare variables</strong> to rename <code>Main color</code> to{' '}
        <code>Color</code> and clean up the variable names. The import then updates the existing
        variables instead of creating new ones.
      </p>
      <div className="tx-actions">
        <Button variant="primary" loading={preparing} onClick={onPrepare}>
          {preparing ? 'Preparing…' : 'Prepare variables'}
        </Button>
      </div>
      <p className="tx-subtle">
        After importing the updated variables you should finish the color migration (including
        cleaning up <code>Support color</code> in components).{' '}
        <Button variant="tertiary" data-size="sm" onClick={onOpenGuide}>
          Open migration guide
        </Button>
      </p>
    </section>
  )
}

function MessageCard({
  heading,
  children,
  onOpenGuide,
}: {
  heading: string
  children: React.ReactNode
  onOpenGuide: () => void
}): React.JSX.Element {
  return (
    <section className="tx-message">
      <Heading level={2} data-size="xs">
        {heading}
      </Heading>
      <p>{children}</p>
      <p className="tx-subtle">
        <Button variant="tertiary" data-size="sm" onClick={onOpenGuide}>
          Open migration guide
        </Button>
      </p>
    </section>
  )
}

function MigrationPrompt({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}): React.JSX.Element {
  const paragraphs = legacyColorMigrationCopy.message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <section className="tx-message">
      <Heading level={2} data-size="xs">
        {legacyColorMigrationCopy.name}
      </Heading>
      {paragraphs.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      <div className="tx-actions">
        <Button variant="primary" onClick={onConfirm}>
          Update and continue
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  )
}

function serializePreview(preview: PreviewData): SerializedPreviewData {
  return {
    ...preview,
    tokenLookupEntries: Array.from(preview.tokenLookup.entries()),
  }
}

function logMessages(label: string, logs: unknown): void {
  if (!Array.isArray(logs)) {
    return
  }
  console.groupCollapsed(label)
  for (const log of logs) {
    console.log(log)
  }
  console.groupEnd()
}
