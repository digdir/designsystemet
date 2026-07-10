import { COLLECTION } from './constants';
import type { PreviewData } from './types';
import { parseNumber } from './utils';

export function getActiveTokenSets(
  preview: PreviewData,
  selectedTheme: string | null,
  selectedScheme: string | null,
): string[] {
  const activeSets: string[] = [];
  const semanticMode = preview.themes.find(
    (mode) => mode.group === COLLECTION.SEMANTIC,
  );
  const theme = preview.themeOptions.find(
    (item) => item.name === selectedTheme,
  );
  const scheme = preview.colorSchemeOptions.find(
    (item) => item.name === selectedScheme,
  );

  appendTokenSets(activeSets, semanticMode?.selectedTokenSets ?? []);
  appendTokenSetNames(activeSets, theme?.tokenSets ?? []);
  appendTokenSetNames(activeSets, scheme?.tokenSets ?? []);

  for (const set of preview.tokenSets) {
    if (activeSets.indexOf(set.path) === -1) {
      activeSets.push(set.path);
    }
  }

  return activeSets;
}

export function resolveValue(
  value: unknown,
  preview: PreviewData,
  activeTokenSets: string[],
  stack: string[] = [],
): unknown {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const exactReference = value.match(/^\{([^}]+)\}$/);
  if (exactReference) {
    return resolveTokenValue(
      exactReference[1],
      preview,
      activeTokenSets,
      stack,
    );
  }

  if (value.indexOf('{') !== -1) {
    return resolveExpression(value, preview, activeTokenSets, stack);
  }

  return value;
}

export function resolveCompositeValue(
  value: unknown,
  preview: PreviewData,
  activeTokenSets: string[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveCompositeValue(item, preview, activeTokenSets),
    );
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        resolveCompositeValue(nested, preview, activeTokenSets),
      ]),
    );
  }

  return resolveValue(value, preview, activeTokenSets, []);
}

export function findUnresolvedReferences(
  preview: PreviewData,
): Array<{ tokenSet: string; path: string; reference: string }> {
  const available = buildAvailableReferenceNames(preview);
  const unresolved: Array<{
    tokenSet: string;
    path: string;
    reference: string;
  }> = [];

  for (const token of preview.flatTokens) {
    for (const reference of token.references) {
      if (
        !available.has(reference) &&
        !isPlannedColorReference(reference, available)
      ) {
        unresolved.push({
          tokenSet: token.tokenSet,
          path: token.path,
          reference,
        });
      }
    }
  }

  return unresolved;
}

function appendTokenSets(
  target: string[],
  selectedTokenSets: Array<{ tokenSet: string; exists: boolean }>,
): void {
  for (const item of selectedTokenSets) {
    if (item.exists && target.indexOf(item.tokenSet) === -1) {
      target.push(item.tokenSet);
    }
  }
}

function appendTokenSetNames(target: string[], tokenSets: string[]): void {
  for (const tokenSet of tokenSets) {
    if (target.indexOf(tokenSet) === -1) {
      target.push(tokenSet);
    }
  }
}

function resolveTokenValue(
  reference: string,
  preview: PreviewData,
  activeTokenSets: string[],
  stack: string[],
): unknown {
  const candidates = getReferenceCandidates(reference);

  for (const path of candidates) {
    if (stack.indexOf(path) !== -1) {
      continue;
    }

    for (const tokenSet of activeTokenSets) {
      const token = preview.tokenLookup[tokenSet + '::' + path];
      if (token) {
        return resolveValue(
          token.value,
          preview,
          activeTokenSets,
          stack.concat(path),
        );
      }
    }
  }

  return null;
}

function resolveExpression(
  expression: string,
  preview: PreviewData,
  activeTokenSets: string[],
  stack: string[],
): unknown {
  let allNumeric = true;
  const replaced = expression.replace(/\{([^}]+)\}/g, (_match, reference) => {
    const value = resolveTokenValue(reference, preview, activeTokenSets, stack);
    const number = parseNumber(value);

    if (number === null) {
      allNumeric = false;
      return '0';
    }

    return String(number);
  });

  if (!allNumeric) {
    return null;
  }

  if (!/^[0-9+\-*/().,\sA-Za-z]+$/.test(replaced)) {
    return null;
  }

  try {
    const fn = new Function(
      'min',
      'max',
      'floor',
      'ceil',
      'round',
      `return (${replaced})`,
    ) as (
      min: Math['min'],
      max: Math['max'],
      floor: Math['floor'],
      ceil: Math['ceil'],
      round: Math['round'],
    ) => unknown;

    return fn(Math.min, Math.max, Math.floor, Math.ceil, Math.round);
  } catch {
    return null;
  }
}

function getReferenceCandidates(reference: string): string[] {
  const candidates = [reference];

  if (reference.indexOf('theme.') === 0) {
    candidates.push(reference.replace(/^theme\./, ''));
  }

  if (reference.indexOf('color.') === 0) {
    candidates.push(reference.replace(/^color\./, 'theme.'));
  }

  return candidates;
}

function buildAvailableReferenceNames(preview: PreviewData): Set<string> {
  const available = new Set<string>();

  for (const token of preview.flatTokens) {
    available.add(token.path);

    if (token.path.indexOf('theme.') === 0) {
      available.add(token.path.replace(/^theme\./, ''));
    }
  }

  for (const collection of preview.collections) {
    for (const variable of collection.variablePreview) {
      const dottedName = variable.name.replace(/\//g, '.');
      available.add(dottedName);

      if (collection.name === COLLECTION.THEME) {
        available.add('theme.' + dottedName);
      }

      if (collection.name === COLLECTION.COLOR_SCHEME) {
        const parts = dottedName.split('.');
        if (parts.length >= 3) {
          available.add('theme.' + parts.slice(1).join('.'));
          available.add('color.' + parts.slice(1).join('.'));
        }
      }
    }
  }

  return available;
}

function isPlannedColorReference(
  reference: string,
  available: Set<string>,
): boolean {
  const parts = reference.split('.');

  if (parts.length < 3 || parts[0] !== 'color') {
    return false;
  }

  const colorName = parts[1];
  const tail = parts.slice(2).join('.');

  return (
    available.has('theme.' + colorName + '.' + tail) ||
    available.has('color.' + colorName + '.' + tail) ||
    hasScaleInAvailableReferences(colorName, available)
  );
}

function hasScaleInAvailableReferences(
  colorName: string,
  available: Set<string>,
): boolean {
  for (const reference of available) {
    if (
      reference.indexOf('theme.' + colorName + '.') === 0 ||
      reference.indexOf('color.' + colorName + '.') === 0
    ) {
      return true;
    }
  }

  return false;
}
