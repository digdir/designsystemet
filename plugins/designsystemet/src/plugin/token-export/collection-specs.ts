import type { FigmaMode } from '@digdir/designsystemet/tokens/create';
import { COLLECTION } from './constants';
import { resolveValue } from './resolver';
import type { FlatToken, TokenModel } from './types';
import { inferVariableName, pathToFigmaName } from './utils';
import {
  convertRawVariableValue,
  mapTokenTypeToVariableType,
} from './variable-values';

export type ValueSpec =
  | {
      kind: 'raw';
      value: VariableValue;
    }
  | {
      kind: 'alias';
      collection: string;
      name: string;
    };

export type VariableSpec = {
  name: string;
  type: VariableResolvedDataType;
  valuesByMode: Map<string, ValueSpec>;
};

export type CollectionSpec = {
  name: string;
  modeNames: string[];
  variables: Map<string, VariableSpec>;
};

export function buildCollectionSpecs(
  model: TokenModel,
  activeTokenSets: string[],
  logs: string[],
): CollectionSpec[] {
  const specs: CollectionSpec[] = [];

  // Collections and their modes come pre-grouped from the CLI (toFigmaCollections).
  for (const [group, modes] of Object.entries(model.figmaCollections)) {
    const collection: CollectionSpec = {
      name: group,
      modeNames: [],
      variables: new Map<string, VariableSpec>(),
    };
    specs.push(collection);

    for (const mode of modes) {
      collection.modeNames.push(mode.modeName);
      buildModeVariables(model, activeTokenSets, group, mode, collection, logs);
    }
  }

  return specs;
}

function buildModeVariables(
  model: TokenModel,
  activeTokenSets: string[],
  group: string,
  mode: FigmaMode,
  collection: CollectionSpec,
  logs: string[],
): void {
  const modeName = mode.modeName;
  const modeActiveTokenSets = getModeActiveTokenSets(
    model,
    activeTokenSets,
    mode,
  );

  for (const selected of mode.tokenSets) {
    if (!selected.exists) {
      continue;
    }

    // `primitives/globals` is a `source` set of raw primitives (border-width, opacity,
    // shadows). These must not become their own variables (e.g. an opacity variable
    // literally named "30") — their values are inlined into the semantic tokens that
    // reference them. They still take part in alias resolution via
    // getModeActiveTokenSets, so consumers resolve to the correct literal.
    if (selected.tokenSet === 'primitives/globals') {
      continue;
    }

    const tokens = model.flatTokens.filter(
      (token) => token.tokenSet === selected.tokenSet,
    );

    for (const token of tokens) {
      const entries = expandVariableEntries(model, group, modeName, token);

      for (const entry of entries) {
        const variableType = mapTokenTypeToVariableType(token.type);
        if (!variableType) {
          continue;
        }

        // Line-height and letter-spacing are written as static values on the text styles
        // (Figma can't bind them per our structure) and are never bound to variables, so
        // we don't emit them as variables. Only font-size is kept from the typography set.
        if (token.type === 'lineHeights' || token.type === 'letterSpacing') {
          continue;
        }

        if (!collection.variables.has(entry.name)) {
          collection.variables.set(entry.name, {
            name: entry.name,
            type: variableType,
            valuesByMode: new Map<string, ValueSpec>(),
          });
        }

        const variable = collection.variables.get(entry.name);
        if (!variable) {
          logs.push(
            `Variable not found for ${group}/${entry.name} (${modeName})`,
          );
          continue;
        }

        const valueSpec = buildValueSpec(
          token,
          model,
          modeActiveTokenSets,
          group,
          modeName,
        );

        if (!valueSpec) {
          logs.push(
            `Skipped unresolved value for ${group}/${entry.name} (${modeName})`,
          );
          continue;
        }

        variable.valuesByMode.set(modeName, valueSpec);
      }
    }
  }
}

function getModeActiveTokenSets(
  model: TokenModel,
  activeTokenSets: string[],
  mode: FigmaMode,
): string[] {
  const prioritized = new Set<string>();

  for (const selected of mode.tokenSets) {
    if (selected.exists) {
      prioritized.add(selected.tokenSet);
    }
  }

  for (const tokenSet of activeTokenSets) {
    prioritized.add(tokenSet);
  }

  for (const item of model.tokenSets) {
    prioritized.add(item.path);
  }

  return Array.from(prioritized);
}

function expandVariableEntries(
  model: TokenModel,
  group: string,
  modeName: string,
  token: FlatToken,
): Array<{ name: string }> {
  if (group === COLLECTION.COLOR_SCHEME || group === COLLECTION.TYPOGRAPHY) {
    const scopedName = inferScopedThemeVariableName(model, token);
    if (scopedName) {
      return [{ name: scopedName }];
    }
  }

  return [{ name: inferVariableName(group, modeName, token) }];
}

function buildValueSpec(
  token: FlatToken,
  model: TokenModel,
  activeTokenSets: string[],
  group: string,
  modeName: string,
): ValueSpec | null {
  const exactReference =
    typeof token.value === 'string' ? token.value.match(/^\{([^}]+)\}$/) : null;

  if (exactReference) {
    const aliasTarget = shouldResolveReferenceAsRaw(token, group)
      ? null
      : mapReferenceToVariableTarget(
          exactReference[1],
          model,
          token,
          group,
          modeName,
        );

    if (aliasTarget) {
      return {
        kind: 'alias',
        collection: aliasTarget.collection,
        name: aliasTarget.name,
      };
    }
  }

  const resolved = resolveValue(token.value, model, activeTokenSets, []);
  const rawValue = convertRawVariableValue(token.type, resolved);

  if (rawValue === null) {
    return null;
  }

  return {
    kind: 'raw',
    value: rawValue,
  };
}

function shouldResolveReferenceAsRaw(token: FlatToken, group: string): boolean {
  // Border-radius tokens in Theme are the first definition of the scale — raw values
  // computed from a math formula. They are the source of truth that other collections
  // (e.g. Semantic) alias back to. Keeping them as aliases here would create a circular
  // reference to a primitive that has no corresponding Figma variable.
  return group === COLLECTION.THEME && token.path.startsWith('border-radius.');
}

function mapReferenceToVariableTarget(
  reference: string,
  model: TokenModel,
  token: FlatToken,
  group: string,
  modeName: string,
): { collection: string; name: string } | null {
  const themeScopedSuffix = getThemeScopedSuffix(reference, model, token);

  if (group === COLLECTION.THEME && themeScopedSuffix) {
    if (
      themeScopedSuffix === 'font-family' ||
      themeScopedSuffix.startsWith('font-weight/')
    ) {
      return {
        collection: COLLECTION.TYPOGRAPHY,
        name: `${modeName}/${themeScopedSuffix}`,
      };
    }

    return {
      collection: COLLECTION.COLOR_SCHEME,
      name: `${modeName}/${themeScopedSuffix}`,
    };
  }

  if (reference.startsWith('theme.')) {
    const suffix = pathToFigmaName(reference.replace(/^theme\./, ''));

    if (group === COLLECTION.COLOR_SCHEME || group === COLLECTION.TYPOGRAPHY) {
      const themePrefix = model.themeOptions[0]?.name || 'theme';
      return {
        collection: group,
        name: `${themePrefix}/${suffix}`,
      };
    }

    return {
      collection: COLLECTION.THEME,
      name: suffix,
    };
  }

  if (reference.startsWith('color.')) {
    if (group === COLLECTION.COLOR) {
      return {
        collection: COLLECTION.SEMANTIC,
        name: pathToFigmaName(reference),
      };
    }

    if (group === COLLECTION.SEMANTIC) {
      return {
        collection: COLLECTION.THEME,
        name: pathToFigmaName(reference),
      };
    }
  }

  if (reference.startsWith('border-radius.')) {
    const name = pathToFigmaName(reference);
    return {
      collection: group === COLLECTION.SEMANTIC ? COLLECTION.THEME : group,
      name,
    };
  }

  if (reference.startsWith('_size.') || reference.startsWith('size._')) {
    const name = reference.startsWith('_size.')
      ? `_size/${reference.replace(/^_size\./, '')}`
      : `_size/${reference.replace(/^size\._/, '')}`;
    return {
      collection: COLLECTION.SIZE,
      name,
    };
  }

  if (reference.startsWith('font-size.')) {
    return {
      collection: COLLECTION.SIZE,
      name: pathToFigmaName(reference),
    };
  }

  if (
    reference.startsWith('font-family') ||
    reference.startsWith('font-weight.') ||
    (group === COLLECTION.THEME && reference.startsWith('border-width.')) ||
    (group === COLLECTION.THEME && reference.startsWith('opacity.'))
  ) {
    return {
      collection: COLLECTION.THEME,
      name: pathToFigmaName(reference),
    };
  }

  // Semantic border-width / opacity tokens (e.g. border-width.default -> {border-width.1},
  // opacity.disabled -> {opacity.30}) reference raw primitives in the source-only
  // primitives/globals set, which we do not emit as variables. Returning null here makes
  // buildValueSpec inline the resolved literal instead of aliasing a non-existent variable.
  return null;
}

function getThemeScopedSuffix(
  reference: string,
  model: TokenModel,
  token: FlatToken,
): string | null {
  const parts = reference.split('.');
  if (parts.length < 2) {
    return null;
  }

  const knownScopes = new Set<string>([
    'theme',
    getThemeNameFromTokenSet(model, token.tokenSet),
    ...model.themeOptions.map((option) => option.name),
  ]);

  if (!knownScopes.has(parts[0])) {
    return null;
  }

  return parts.slice(1).join('/');
}

function inferScopedThemeVariableName(
  model: TokenModel,
  token: FlatToken,
): string | null {
  const parts = token.path.split('.');
  if (parts.length < 2) {
    return null;
  }

  const themeName = getThemeNameFromTokenSet(model, token.tokenSet);
  const knownThemeNames = new Set(
    model.themeOptions.map((option) => option.name),
  );
  const first = parts[0];
  const shouldStripPrefix = first === 'theme' || knownThemeNames.has(first);
  const suffix = shouldStripPrefix ? parts.slice(1) : parts;

  if (suffix.length === 0) {
    return null;
  }

  return `${themeName}/${suffix.join('/')}`;
}

function getThemeNameFromTokenSet(model: TokenModel, tokenSet: string): string {
  const parts = tokenSet.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  if (last && last !== 'theme') {
    return last;
  }

  if (last === 'theme') {
    const prev = parts[parts.length - 2];
    if (
      prev &&
      prev !== 'light' &&
      prev !== 'dark' &&
      prev !== 'primary' &&
      prev !== 'secondary'
    ) {
      return prev;
    }
  }

  return model.themeOptions[0]?.name || last || 'theme';
}
