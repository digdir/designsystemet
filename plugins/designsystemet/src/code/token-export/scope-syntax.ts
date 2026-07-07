// Auto-applies Figma variable scopes and WEB CSS code syntax after an import, so users
// get correct scoping/syntax out of the box without a separate step. Ported from the
// standalone "Code syntax & scoping" plugin (scoper/) — the rules are keyed on
// (collection name, resolved type, variable name) and are idempotent.

type MigrationState = 'pre' | 'post' | 'half' | 'not-library'

// The color migration reshapes the variables: pre-migration uses `Main color` +
// `Support color` collections with variables prefixed `color/main/`; post-migration these
// fold into a single `Color` collection (Support color removed) and the prefix is stripped.
const LEGACY_COLOR_PREFIX = 'color/main/'

function getSyntaxCollections(state: MigrationState): string[] {
  if (state === 'post') {
    return ['Color', 'Semantic', 'Size', 'Theme']
  }
  if (state === 'half') {
    return ['Color', 'Main color', 'Support color', 'Semantic', 'Size', 'Theme']
  }
  return ['Main color', 'Semantic', 'Support color', 'Size', 'Theme']
}

function getScopeCollections(state: MigrationState): string[] {
  return [...getSyntaxCollections(state), 'Color scheme', 'Typography']
}

function detectMigrationState(
  collections: VariableCollection[],
  variablesByCollectionId: Map<string, Variable[]>,
): MigrationState {
  const hasMainColor = collections.some((c) => c.name === 'Main color')
  const hasSupportColor = collections.some((c) => c.name === 'Support color')
  const hasColor = collections.some((c) => c.name === 'Color')

  let prefixedCount = 0
  for (const collection of collections) {
    if (collection.name !== 'Main color' && collection.name !== 'Color') {
      continue
    }
    for (const variable of variablesByCollectionId.get(collection.id) ?? []) {
      if (variable.name.startsWith(LEGACY_COLOR_PREFIX)) {
        prefixedCount++
      }
    }
  }

  if (!hasColor && !hasMainColor && !hasSupportColor) {
    return 'not-library'
  }
  if (hasColor && !hasMainColor && !hasSupportColor && prefixedCount === 0) {
    return 'post'
  }
  if (!hasColor && (hasMainColor || hasSupportColor)) {
    return 'pre'
  }
  return 'half'
}

function getFormattedName(variable: Variable): { fullName: string; name: string } {
  const fullName = variable.name.toLowerCase()
  const name = variable.name.split('/').pop()?.replace(/\s+/g, '-').toLowerCase() || ''
  return { fullName, name }
}

function getScopes(
  collectionName: string,
  resolvedType: VariableResolvedDataType,
  fullName: string,
): VariableScope[] {
  if (resolvedType === 'COLOR') {
    if (
      collectionName === 'Semantic' ||
      collectionName === 'Main color' ||
      collectionName === 'Support color' ||
      collectionName === 'Color'
    ) {
      // ALL_SCOPES for a COLOR variable covers exactly the color fields (fills, strokes,
      // effects). Cannot be combined with other scopes.
      return ['ALL_SCOPES']
    }
    return []
  }

  if (resolvedType === 'FLOAT') {
    if (collectionName === 'Size' && fullName.includes('font-size/')) {
      return ['FONT_SIZE']
    }
    if (collectionName === 'Semantic') {
      if (fullName.includes('opacity')) return ['OPACITY']
      if (fullName.includes('border-width')) return ['STROKE_FLOAT']
      if (fullName.includes('border-radius')) return ['CORNER_RADIUS']
      if (fullName.includes('size/')) return ['GAP', 'WIDTH_HEIGHT']
    }
    return []
  }

  if (resolvedType === 'STRING' && collectionName === 'Theme') {
    if (fullName.includes('font-weight/')) return ['FONT_STYLE']
    if (fullName === 'font-family') return ['FONT_FAMILY']
  }

  return []
}

function getExpectedSyntax(
  collectionName: string,
  resolvedType: VariableResolvedDataType,
  fullName: string,
  name: string,
): string | null {
  if (resolvedType === 'COLOR' && collectionName !== 'Theme') {
    if (fullName === 'link/color/visited') {
      return 'var(--ds-link-color-visited)'
    }
    if (fullName.includes('focus/inner')) {
      return 'var(--ds-color-focus-inner)'
    }
    if (fullName.includes('focus/outer')) {
      return 'var(--ds-color-focus-outer)'
    }
    // Semantic colors are locked to one color regardless of data-color/mode, so their CSS
    // var always includes the color-group name (read from the path). Color / Main color /
    // Support color stay group-less — the data-color attribute selects the color at runtime.
    if (collectionName === 'Semantic') {
      const [, colorName, ...rest] = fullName.split('/')
      const semanticName = [colorName, ...rest].filter(Boolean).join('-') || name
      return `var(--ds-color-${semanticName})`
    }
    return `var(--ds-color-${name})`
  }

  if (resolvedType === 'FLOAT' && collectionName !== 'Theme') {
    if (fullName.startsWith('_size/')) return null
    if (fullName.includes('font-size/')) return `var(--ds-font-size-${name})`
    if (fullName.includes('border-radius')) return `var(--ds-border-radius-${name})`
    if (fullName.includes('border-width')) return `var(--ds-border-width-${name})`
    if (fullName.includes('opacity')) return `var(--ds-opacity-${name})`
    if (fullName.includes('size/')) return `var(--ds-size-${name})`
    const collectionSlug = collectionName.toLowerCase().replace(/\s+/g, '-')
    return `var(--ds-${collectionSlug}-${name})`
  }

  if (collectionName === 'Theme' && resolvedType === 'STRING') {
    if (fullName.includes('font-weight/')) return `var(--ds-font-weight-${name})`
    if (fullName === 'font-family') return 'var(--ds-font-family)'
  }

  return null
}

function normalizeScopes(scopes: readonly VariableScope[]): string {
  return [...scopes].sort().join('|')
}

// Sets scopes and WEB code syntax on all relevant local variables. Best-effort and
// idempotent: safe to run after every import. Appends a short summary to `logs`, plus a
// few samples of variables in syntax collections that matched no rule (naming drift).
export async function applyScopesAndSyntax(logs: string[]): Promise<void> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const allVariables = await figma.variables.getLocalVariablesAsync()

  const variablesByCollectionId = new Map<string, Variable[]>()
  for (const variable of allVariables) {
    const existing = variablesByCollectionId.get(variable.variableCollectionId)
    if (existing) {
      existing.push(variable)
    } else {
      variablesByCollectionId.set(variable.variableCollectionId, [variable])
    }
  }

  const state = detectMigrationState(collections, variablesByCollectionId)
  if (state === 'not-library') {
    logs.push('Scope/syntax: no color collections found; skipped.')
    return
  }

  const syntaxCollections = getSyntaxCollections(state)
  const scopeCollections = getScopeCollections(state)
  const targetCollections = collections.filter((c) => scopeCollections.includes(c.name))

  let scopeChanged = 0
  let syntaxUpdated = 0
  let noRuleCount = 0
  const noRuleSamples: string[] = []

  for (const collection of targetCollections) {
    const isSyntaxCollection = syntaxCollections.includes(collection.name)

    for (const variable of variablesByCollectionId.get(collection.id) ?? []) {
      const { fullName, name } = getFormattedName(variable)

      const scopes = getScopes(collection.name, variable.resolvedType, fullName)
      if (normalizeScopes(scopes) !== normalizeScopes(variable.scopes ?? [])) {
        variable.scopes = scopes
        scopeChanged++
      }

      let syntaxMatched = false
      if (isSyntaxCollection) {
        const expected = getExpectedSyntax(collection.name, variable.resolvedType, fullName, name)
        if (expected) {
          syntaxMatched = true
          if ((variable.codeSyntax.WEB?.trim() || '') !== expected) {
            variable.setVariableCodeSyntax('WEB', expected)
            syntaxUpdated++
          }
        }
      }

      // Flag variables in syntax collections (which we expect to be fully covered) that
      // matched neither a scope nor a syntax rule — a likely naming-drift signal. Empty
      // scopes in scope-only collections (Color scheme / Typography) are intentional.
      if (isSyntaxCollection && scopes.length === 0 && !syntaxMatched) {
        noRuleCount++
        if (noRuleSamples.length < 10) {
          noRuleSamples.push(`${collection.name}/${variable.name} (${variable.resolvedType})`)
        }
      }
    }
  }

  logs.push(
    `Scope/syntax (${state}): scopes set on ${scopeChanged}, syntax set on ${syntaxUpdated}, ${noRuleCount} without a matching rule.`,
  )
  for (const sample of noRuleSamples) {
    logs.push(`Scope/syntax: no rule matched for ${sample}`)
  }
}
