import { legacyColorMigrationCopy } from './config-generator'
import { getActiveTokenSets, resolveValue } from './resolver'
import type {
  BorderRadiusPreview,
  PreviewData,
  SemanticColorScale,
  UiState,
  VariableStructureStatus,
} from './types'
import { escapeHtml, formatValue, parseNumber, toCssColor } from './utils'

const SEMANTIC_ROLE_ORDER = [
  'background-default',
  'background-tinted',
  'surface-default',
  'surface-tinted',
  'surface-hover',
  'surface-active',
  'border-subtle',
  'border-default',
  'border-strong',
  'text-subtle',
  'text-default',
  'base-default',
  'base-hover',
  'base-active',
  'base-contrast-subtle',
  'base-contrast-default',
] as const

// Renders the theme preview (theme/scheme controls + color scales + border radii). The
// caller decides where this goes; warnings and status live in the header banner.
export function renderPreviewBody(state: UiState, animate: boolean): string {
  const preview = state.preview
  if (!preview) {
    return ''
  }

  const activeTokenSets = getActiveTokenSets(preview, state.selectedTheme, state.selectedScheme)
  const controls = `${renderThemeControls(preview, state)}${renderSchemeControls(preview, state)}`

  // The preview surface follows the selected scheme (not the user's Figma theme) so light
  // colors are read on a light surface and dark colors on a dark one. The reveal animation
  // only plays when `animate` is set (first reveal and scheme switch — not theme switch).
  const surface = /dark/i.test(state.selectedScheme || '') ? 'dark' : 'light'
  const animateClass = animate ? ' preview-surface--animate' : ''

  return `
    ${controls ? `<section class="hero"><div class="control-row">${controls}</div></section>` : ''}
    <section>
      <div class="preview-surface preview-surface--${surface}${animateClass}">
        <div class="preview-layout">
          ${renderColorScales(preview.semanticColorScales, preview, activeTokenSets)}
          ${renderBorderRadii(preview.borderRadii, preview, activeTokenSets)}
        </div>
      </div>
    </section>
  `
}

export function renderPrepareGate(state: UiState): string {
  const preparing = state.isPreparingVariables
  return `
    <section>
      <div class="migration-prompt">
        <h2>Old variable structure</h2>
        <p>
          This Figma file uses the old color structure with <code>Main color</code> and
          <code>Support color</code>. Importing would create a new <code>Color</code>
          collection alongside the old ones and break the file's bindings.
        </p>
        <p>
          Click <strong>Prepare variables</strong> to rename <code>Main color</code> to
          <code>Color</code> and clean up the variable names. The import then updates the
          existing variables instead of creating new ones.
        </p>
        <div class="control-row">
          <button type="button" class="primary" data-action="prepare-variables" ${preparing ? 'disabled' : ''}>
            ${preparing ? 'Preparing…' : 'Prepare variables'}
          </button>
        </div>
        <p class="subtitle">
          After importing the updated variables you should finish the color migration
          (including cleaning up <code>Support color</code> in components).
          <button type="button" class="linklike" data-action="open-guide">Open migration guide</button>
        </p>
      </div>
    </section>
  `
}

export function renderAmbiguousStructure(structure: VariableStructureStatus): string {
  return `
    <section>
      <div class="migration-prompt">
        <h2>Can't prepare automatically</h2>
        <p>${escapeHtml(structure.message)}</p>
        <p class="subtitle">
          <button type="button" class="linklike" data-action="open-guide">Open migration guide</button>
        </p>
      </div>
    </section>
  `
}

export function renderMigrationPrompt(): string {
  const paragraphs = legacyColorMigrationCopy.message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')

  return `
    <section>
      <div class="migration-prompt">
        <h2>${escapeHtml(legacyColorMigrationCopy.name)}</h2>
        ${paragraphs}
        <div class="control-row">
          <button type="button" class="primary" data-action="confirm-migrate">Update and continue</button>
          <button type="button" data-action="cancel-migrate">Cancel</button>
        </div>
      </div>
    </section>
  `
}

function renderThemeControls(preview: PreviewData, state: UiState): string {
  if (preview.themeOptions.length <= 1) {
    return ''
  }

  return `
    <div>
      <div class="muted">Theme</div>
      <div class="segments">
        ${preview.themeOptions
          .map(
            (theme) => `
              <button class="segment ${theme.name === state.selectedTheme ? 'active' : ''}" data-theme="${escapeHtml(theme.name)}">
                ${escapeHtml(theme.name)}
              </button>
            `,
          )
          .join('')}
      </div>
    </div>
  `
}

function renderSchemeControls(preview: PreviewData, state: UiState): string {
  if (preview.colorSchemeOptions.length <= 1) {
    return ''
  }

  // Always show Light before Dark (and any custom schemes in between).
  const rank = (name: string) => (/light/i.test(name) ? 0 : /dark/i.test(name) ? 2 : 1)
  const ordered = preview.colorSchemeOptions
    .slice()
    .sort((a, b) => rank(a.name) - rank(b.name))

  return `
    <div>
      <div class="muted">Color scheme</div>
      <div class="segments">
        ${ordered
          .map(
            (scheme) => `
              <button class="segment ${scheme.name === state.selectedScheme ? 'active' : ''}" data-scheme="${escapeHtml(scheme.name)}">
                ${escapeHtml(scheme.name)}
              </button>
            `,
          )
          .join('')}
      </div>
    </div>
  `
}

function renderColorScales(
  scales: SemanticColorScale[],
  preview: PreviewData,
  activeTokenSets: string[],
): string {
  if (scales.length === 0) {
    return '<div class="empty">No semantic color scales found.</div>'
  }

  return `
    <div class="color-grid">
      ${scales.map((scale) => renderColorScale(scale, preview, activeTokenSets)).join('')}
    </div>
  `
}

function renderColorScale(
  scale: SemanticColorScale,
  preview: PreviewData,
  activeTokenSets: string[],
): string {
  const orderedRoles = sortSemanticRoles(scale.roles)

  return `
    <div class="color-row">
      <span class="color-row-label" title="${escapeHtml(scale.name)}">${escapeHtml(scale.name)}</span>
      <div class="swatches">
        ${orderedRoles.map((role) => renderSwatch(role, preview, activeTokenSets)).join('')}
      </div>
    </div>
  `
}

function renderSwatch(
  role: SemanticColorScale['roles'][number],
  preview: PreviewData,
  activeTokenSets: string[],
): string {
  const resolved = resolveValue(role.value, preview, activeTokenSets, [])
  const color = toCssColor(resolved)

  return `
    <div class="swatch ${color ? 'has-color' : ''}" title="${escapeHtml(role.name)}" style="${color ? `--swatch:${escapeHtml(color)};` : ''}"></div>
  `
}

function renderBorderRadii(
  radii: BorderRadiusPreview[],
  preview: PreviewData,
  activeTokenSets: string[],
): string {
  if (radii.length === 0) {
    return ''
  }

  return `
    <div class="color-row">
      <span class="color-row-label muted">Border radius</span>
      <div class="radius-row">
        ${radii
          .map((radius) => {
            const resolved = resolveValue(radius.value, preview, activeTokenSets, [])
            const number = parseNumber(resolved)
            const cssValue = number === null ? 0 : Math.max(0, number)
            const label = number === null ? formatValue(radius.value) : `${number}px`

            return `
              <div class="radius-item" title="${escapeHtml(radius.name)}: ${escapeHtml(label)}">
                <span class="radius-label">${escapeHtml(radius.name)}</span>
                <div class="radius-sample" style="--radius:${cssValue}px"></div>
              </div>
            `
          })
          .join('')}
      </div>
    </div>
  `
}

function sortSemanticRoles(
  roles: SemanticColorScale['roles'],
): SemanticColorScale['roles'] {
  return roles.slice().sort((a, b) => {
    const indexA = SEMANTIC_ROLE_ORDER.indexOf(a.name as (typeof SEMANTIC_ROLE_ORDER)[number])
    const indexB = SEMANTIC_ROLE_ORDER.indexOf(b.name as (typeof SEMANTIC_ROLE_ORDER)[number])
    const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
    const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB

    if (safeA !== safeB) {
      return safeA - safeB
    }

    return a.name.localeCompare(b.name)
  })
}
