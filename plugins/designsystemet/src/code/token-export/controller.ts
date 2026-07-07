import type { ModuleBridge, UiModule } from '../../ui/shell'
import {
  buildPreviewFromConfigText,
  isLegacyColorConfig,
  migrateLegacyColorConfig,
} from './config-generator'
import { tokenExportManifest } from './manifest'
import {
  renderAmbiguousStructure,
  renderMigrationPrompt,
  renderPrepareGate,
  renderPreviewBody,
} from './render'
import type { Notification, PreviewData, SerializedPreviewData, UiState } from './types'
import { escapeHtml } from './utils'

const MIGRATION_GUIDE_URL = 'https://designsystemet.no/en/blog/migrate-simpler-color'

type View = 'prepare' | 'ambiguous' | 'migrate' | 'preview' | 'paste'

const CHROME = `
  <div class="te-app">
    <header class="te-header">
      <button type="button" id="te-back" class="te-back" data-action="go-home" hidden>← Go back</button>
      <h1>Export theme to Figma</h1>
    </header>

    <div id="te-banner" class="te-banner-slot"></div>

    <main class="te-content">
      <section id="te-paste" class="config-entry">
        <h2>Paste config file</h2>
        <textarea id="config-input" spellcheck="false" placeholder="Paste config here…"></textarea>
      </section>
      <div id="te-dynamic"></div>
    </main>

    <footer class="te-footer">
      <div class="te-footer-left" id="te-footer-left"></div>
      <div class="te-footer-right" id="te-footer-right"></div>
    </footer>

    <div id="overlay" class="overlay" aria-hidden="true">
      <div class="overlay-card" role="status" aria-live="polite">
        <div class="spinner"></div>
        <p id="overlay-text" class="overlay-text">Exporting to Figma…</p>
      </div>
    </div>
  </div>
`

export function createTokenExportController(): UiModule {
  return {
    manifest: tokenExportManifest,
    mount(root: HTMLElement, bridge: ModuleBridge) {
      root.innerHTML = CHROME

      const state: UiState = {
        preview: null,
        selectedTheme: null,
        selectedScheme: null,
        isImporting: false,
        pendingLegacyConfig: null,
        variableStructure: null,
        isPreparingVariables: false,
        notification: null,
      }

      // Set for the next render only, so the preview reveal animation plays on first
      // reveal and on color-scheme switch — but not on theme switch or other re-renders.
      let revealOnNextRender = false

      const el = {
        back: requireElement<HTMLButtonElement>(root, 'te-back'),
        banner: requireElement<HTMLElement>(root, 'te-banner'),
        paste: requireElement<HTMLElement>(root, 'te-paste'),
        dynamic: requireElement<HTMLElement>(root, 'te-dynamic'),
        configInput: requireElement<HTMLTextAreaElement>(root, 'config-input'),
        footerLeft: requireElement<HTMLElement>(root, 'te-footer-left'),
        footerRight: requireElement<HTMLElement>(root, 'te-footer-right'),
        overlay: requireElement<HTMLElement>(root, 'overlay'),
      }

      function computeView(): View {
        const structure = state.variableStructure
        if (structure?.state === 'ambiguous') {
          return 'ambiguous'
        }
        if (structure?.state === 'needs-prepare') {
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

      function notify(notification: Notification | null): void {
        state.notification = notification
      }

      async function uploadConfig(): Promise<void> {
        if (state.isImporting) {
          return
        }

        const configText = el.configInput.value.trim()
        if (!configText) {
          notify({ kind: 'error', text: 'Paste a config first.' })
          render()
          return
        }

        // Detect the removed main/support color categories and ask before migrating,
        // rather than failing on schema validation with a cryptic error. The migration
        // dialog explains everything, so no banner is shown alongside it.
        if (isLegacyColorConfig(configText)) {
          state.pendingLegacyConfig = migrateLegacyColorConfig(configText)
          notify(null)
          render()
          return
        }

        await buildPreview(configText)
      }

      async function buildPreview(configText: string): Promise<void> {
        try {
          const preview = await buildPreviewFromConfigText(configText)
          state.preview = preview
          revealOnNextRender = true
          state.selectedTheme = preview.themeOptions[0]?.name || null
          // Default to the light scheme when present so the preview opens on a light
          // surface; fall back to the first scheme otherwise.
          const lightScheme = preview.colorSchemeOptions.find((option) =>
            /light/i.test(option.name),
          )
          state.selectedScheme =
            (lightScheme || preview.colorSchemeOptions[0])?.name || null
          notify(
            preview.warnings.length > 0
              ? {
                  kind: 'warning',
                  text: `Preview generated with ${preview.warnings.length} warning${preview.warnings.length === 1 ? '' : 's'}.`,
                  details: preview.warnings,
                }
              : null,
          )
          render()
        } catch (error) {
          console.error('Failed to generate preview from config', error)
          notify({
            kind: 'error',
            text: error instanceof Error ? error.message : 'Could not generate tokens from config.',
          })
          render()
        }
      }

      function exportToFigma(): void {
        if (!state.preview || state.isImporting) {
          return
        }
        state.isImporting = true
        notify(null)
        render()
        bridge.send('import-to-figma', {
          preview: serializePreview(state.preview),
          selectedTheme: state.selectedTheme,
          selectedScheme: state.selectedScheme,
        })
      }

      root.addEventListener('click', (event) => {
        const target = event.target
        if (!(target instanceof Element)) {
          return
        }

        const action = target.closest<HTMLElement>('[data-action]')?.dataset.action
        switch (action) {
          case 'go-home':
            bridge.goHome()
            return
          case 'upload':
            void uploadConfig()
            return
          case 'export':
            exportToFigma()
            return
          case 'new-config':
            state.preview = null
            notify(null)
            render()
            return
          case 'prepare-variables':
            if (!state.isPreparingVariables) {
              state.isPreparingVariables = true
              render()
              bridge.send('prepare-variables')
            }
            return
          case 'open-guide':
            bridge.openExternal(MIGRATION_GUIDE_URL)
            return
          case 'confirm-migrate': {
            const migrated = state.pendingLegacyConfig
            if (migrated) {
              el.configInput.value = migrated
              state.pendingLegacyConfig = null
              void buildPreview(migrated)
            }
            return
          }
          case 'cancel-migrate':
            state.pendingLegacyConfig = null
            notify({ kind: 'info', text: 'Migration cancelled. The config was not changed.' })
            render()
            return
          case 'dismiss-banner':
            notify(null)
            render()
            return
        }

        if (!state.preview) {
          return
        }
        const selector = target.closest<HTMLElement>('[data-theme], [data-scheme]')
        if (!selector) {
          return
        }
        if (selector.dataset.theme) {
          state.selectedTheme = selector.dataset.theme
        }
        if (selector.dataset.scheme) {
          state.selectedScheme = selector.dataset.scheme
          // Reveal animation is meaningful on scheme change, but not theme change.
          revealOnNextRender = true
        }
        render()
      })

      bridge.onMessage((message) => {
        if (message.type === 'import-success') {
          state.isImporting = false
          notify({ kind: 'success', text: 'Exported to Figma.' })
          logMessages('DS Theme Importer', message.logs)
          render()
          return
        }

        if (message.type === 'import-error') {
          state.isImporting = false
          notify({ kind: 'error', text: (message.message as string) || 'Export failed.' })
          console.error('Import failed', message.message)
          render()
          return
        }

        if (message.type === 'variable-structure-status') {
          state.variableStructure = (message.status as UiState['variableStructure']) || null
          render()
          return
        }

        if (message.type === 'prepare-variables-result') {
          state.isPreparingVariables = false
          const result = (message.result as { status?: string; message?: string }) || {}
          if (result.status === 'error') {
            notify({ kind: 'error', text: result.message || 'Could not prepare the variables.' })
          } else {
            notify({
              kind: 'success',
              text:
                result.status === 'noop'
                  ? 'Variables were already prepared.'
                  : 'Variables prepared. You can now import.',
            })
          }
          render()
          return
        }
      })

      function render(): void {
        const view = computeView()

        el.back.hidden = !bridge.canGoHome
        el.paste.hidden = view !== 'paste'

        if (view === 'paste') {
          el.dynamic.hidden = true
          el.dynamic.innerHTML = ''
        } else {
          el.dynamic.hidden = false
          el.dynamic.innerHTML =
            view === 'preview'
              ? renderPreviewBody(state, revealOnNextRender)
              : view === 'prepare'
                ? renderPrepareGate(state)
                : view === 'ambiguous' && state.variableStructure
                  ? renderAmbiguousStructure(state.variableStructure)
                  : renderMigrationPrompt()
        }

        el.banner.innerHTML = renderBanner(state.notification)
        el.footerLeft.innerHTML =
          view === 'preview'
            ? '<button type="button" class="te-tertiary" data-action="new-config">Upload new config file</button>'
            : ''
        el.footerRight.innerHTML = renderFooterRight(view, state)

        const busy = state.isImporting
        el.overlay.classList.toggle('visible', busy)
        el.overlay.setAttribute('aria-hidden', busy ? 'false' : 'true')

        // The reveal is a one-shot; clear it so later re-renders don't replay it.
        revealOnNextRender = false
      }

      function serializePreview(preview: PreviewData): SerializedPreviewData {
        return {
          ...preview,
          tokenLookupEntries: Array.from(preview.tokenLookup.entries()),
        }
      }

      // Initial paint, then ask the plugin code to inspect the file's color variable
      // structure so we can gate import behind preparation when the old Main/Support
      // color structure is present.
      render()
      bridge.send('check-variable-structure')
    },
  }
}

function renderFooterRight(view: View, state: UiState): string {
  if (view === 'paste') {
    return '<button type="button" class="primary" data-action="upload">Upload</button>'
  }
  if (view === 'preview') {
    return `<button type="button" class="primary" data-action="export" ${state.isImporting ? 'disabled' : ''}>Export to Figma</button>`
  }
  return ''
}

function renderBanner(notification: Notification | null): string {
  if (!notification) {
    return ''
  }
  const details = notification.details?.length
    ? `<ul class="te-banner-details">${notification.details
        .slice(0, 8)
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join('')}</ul>`
    : ''
  return `
    <div class="te-banner te-banner--${notification.kind}" role="status">
      <div class="te-banner-body">
        <span>${escapeHtml(notification.text)}</span>
        ${details}
      </div>
      <button type="button" class="te-banner-close" data-action="dismiss-banner" aria-label="Dismiss">×</button>
    </div>
  `
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

function requireElement<T extends HTMLElement>(root: HTMLElement, id: string): T {
  const element = root.querySelector<HTMLElement>(`#${id}`)
  if (!element) {
    throw new Error(`Missing required element: ${id}`)
  }
  return element as T
}
