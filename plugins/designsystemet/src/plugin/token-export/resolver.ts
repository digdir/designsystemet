import { FIGMA_COLLECTION } from '@digdir/designsystemet/tokens/create';
import type { FlatToken, TokenModel } from './types';
import { figmaNameToPath, parseNumber } from './utils';

// Lookup from `tokenSet::path` to token, built lazily per model. Kept out of
// the model itself so it never has to be serialized.
const tokenLookups = new WeakMap<TokenModel, Map<string, FlatToken>>();

function getTokenLookup(model: TokenModel): Map<string, FlatToken> {
  let lookup = tokenLookups.get(model);
  if (!lookup) {
    lookup = new Map();
    for (const token of model.flatTokens) {
      lookup.set(token.tokenSet + '::' + token.path, token);
    }
    tokenLookups.set(model, lookup);
  }
  return lookup;
}

// The order token sets are searched in when resolving a `{reference}`: the first set
// that defines the path wins. Every set is included, so this is a priority order, not
// a filter.
//
// Variables get one value per mode, so they never depend on this order beyond a mode's
// own sets (see collection-specs). Text and effect styles are not mode-aware, though:
// a style holds one font family and one shadow colour. Anything they resolve that
// differs per theme or scheme (`themes/<name>`, the colour-scheme sets) is taken from
// the first theme in the light scheme, whose sets are placed before the rest here.
export function getTokenSetLookupOrder(model: TokenModel): string[] {
  const order = new Set<string>();
  const semanticMode = model.themes.find(
    (mode) => mode.group === FIGMA_COLLECTION.SEMANTIC,
  );
  // themeOptions keep config order; colorSchemeOptions are sorted light first.
  const theme = model.themeOptions[0];
  const scheme = model.colorSchemeOptions[0];

  for (const item of semanticMode?.selectedTokenSets ?? []) {
    if (item.exists) {
      order.add(item.tokenSet);
    }
  }
  for (const tokenSet of theme?.tokenSets ?? []) {
    order.add(tokenSet);
  }
  for (const tokenSet of scheme?.tokenSets ?? []) {
    order.add(tokenSet);
  }
  for (const set of model.tokenSets) {
    order.add(set.path);
  }

  return Array.from(order);
}

export function resolveValue(
  value: unknown,
  model: TokenModel,
  tokenSetOrder: string[],
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
    return resolveTokenValue(exactReference[1], model, tokenSetOrder, stack);
  }

  if (value.includes('{')) {
    return resolveExpression(value, model, tokenSetOrder, stack);
  }

  return value;
}

export function resolveCompositeValue(
  value: unknown,
  model: TokenModel,
  tokenSetOrder: string[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveCompositeValue(item, model, tokenSetOrder),
    );
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        resolveCompositeValue(nested, model, tokenSetOrder),
      ]),
    );
  }

  return resolveValue(value, model, tokenSetOrder, []);
}

export function findUnresolvedReferences(
  model: TokenModel,
): Array<{ tokenSet: string; path: string; reference: string }> {
  const available = buildAvailableReferenceNames(model);
  const unresolved: Array<{
    tokenSet: string;
    path: string;
    reference: string;
  }> = [];

  for (const token of model.flatTokens) {
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

function resolveTokenValue(
  reference: string,
  model: TokenModel,
  tokenSetOrder: string[],
  stack: string[],
): unknown {
  const candidates = getReferenceCandidates(reference);
  const lookup = getTokenLookup(model);

  for (const path of candidates) {
    if (stack.includes(path)) {
      continue;
    }

    for (const tokenSet of tokenSetOrder) {
      const token = lookup.get(tokenSet + '::' + path);
      if (token) {
        return resolveValue(
          token.value,
          model,
          tokenSetOrder,
          stack.concat(path),
        );
      }
    }
  }

  return null;
}

function resolveExpression(
  expression: string,
  model: TokenModel,
  tokenSetOrder: string[],
  stack: string[],
): unknown {
  let allNumeric = true;
  const replaced = expression.replace(/\{([^}]+)\}/g, (_match, reference) => {
    const value = resolveTokenValue(reference, model, tokenSetOrder, stack);
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

  if (reference.startsWith('theme.')) {
    candidates.push(reference.replace(/^theme\./, ''));
  }

  if (reference.startsWith('color.')) {
    candidates.push(reference.replace(/^color\./, 'theme.'));
  }

  return candidates;
}

function buildAvailableReferenceNames(model: TokenModel): Set<string> {
  const available = new Set<string>();

  for (const token of model.flatTokens) {
    available.add(token.path);

    if (token.path.startsWith('theme.')) {
      available.add(token.path.replace(/^theme\./, ''));
    }
  }

  for (const collection of model.collections) {
    for (const variable of collection.variablePreview) {
      const dottedName = figmaNameToPath(variable.name);
      available.add(dottedName);

      if (collection.name === FIGMA_COLLECTION.THEME) {
        available.add('theme.' + dottedName);
      }

      if (collection.name === FIGMA_COLLECTION.COLOR_SCHEME) {
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
      reference.startsWith('theme.' + colorName + '.') ||
      reference.startsWith('color.' + colorName + '.')
    ) {
      return true;
    }
  }

  return false;
}
