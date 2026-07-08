import { COLLECTION } from './constants';

// Names from the old Core UI Kit variable structure that predate the flattened
// single "Color" collection. Mirrors the "prime" step of the migration-plugin.
const MAIN_COLOR = 'Main color';
const SUPPORT_COLOR = 'Support color';
const VARIABLE_PREFIX = 'color/main/';

export type VariableStructureStatus = {
  // - ok: nothing to prepare (clean Color collection, or a fresh file with no color
  //   collections at all).
  // - needs-prepare: the old "Main color" structure (or color/main/ prefix) is present
  //   and would break an import. Prime must run first.
  // - ambiguous: both "Main color" and "Color" exist, or multiple "Main color"
  //   collections. We cannot safely auto-prime; the user must resolve it manually.
  state: 'ok' | 'needs-prepare' | 'ambiguous';
  hasMainColor: boolean;
  hasSupportColor: boolean;
  hasColor: boolean;
  message: string;
};

export type PrepareResult = {
  status: 'success' | 'noop' | 'error';
  message: string;
  renamedCollection: boolean;
  renamedVariableCount: number;
  // Whether a leftover "Support color" collection remains after priming. The component
  // cleanup for it lives in the separate migration-plugin, not here.
  hasSupportColor: boolean;
};

async function countPrefixedVariables(
  collections: VariableCollection[],
): Promise<number> {
  let count = 0;
  for (const collection of collections) {
    if (
      collection.name !== MAIN_COLOR &&
      collection.name !== COLLECTION.COLOR
    ) {
      continue;
    }
    for (const variableId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (variable && variable.name.startsWith(VARIABLE_PREFIX)) {
        count += 1;
      }
    }
  }
  return count;
}

export async function checkVariableStructure(): Promise<VariableStructureStatus> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const mainColorCount = collections.filter(
    (c) => c.name === MAIN_COLOR,
  ).length;
  const hasMainColor = mainColorCount > 0;
  const hasSupportColor = collections.some((c) => c.name === SUPPORT_COLOR);
  const hasColor = collections.some((c) => c.name === COLLECTION.COLOR);
  const prefixedVariableCount = await countPrefixedVariables(collections);

  // Can't safely rename "Main color" -> "Color" when a "Color" already exists, or when
  // there are several "Main color" collections.
  if ((hasMainColor && hasColor) || mainColorCount > 1) {
    return {
      state: 'ambiguous',
      hasMainColor,
      hasSupportColor,
      hasColor,
      message:
        'Filen har både «Main color» og «Color» (eller flere «Main color»-collections). Behold kun den du vil oppdatere før du fortsetter.',
    };
  }

  if (hasMainColor || prefixedVariableCount > 0) {
    return {
      state: 'needs-prepare',
      hasMainColor,
      hasSupportColor,
      hasColor,
      message:
        'Filen bruker den gamle variabelstrukturen og må forberedes før import.',
    };
  }

  return {
    state: 'ok',
    hasMainColor,
    hasSupportColor,
    hasColor,
    message: 'Variabelstrukturen er klar.',
  };
}

export async function prepareVariables(): Promise<PrepareResult> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const mainColorCollections = collections.filter((c) => c.name === MAIN_COLOR);
  const colorCollections = collections.filter(
    (c) => c.name === COLLECTION.COLOR,
  );
  const hasSupportColor = collections.some((c) => c.name === SUPPORT_COLOR);

  if (mainColorCollections.length > 1) {
    return {
      status: 'error',
      message: `Fant ${mainColorCollections.length} «${MAIN_COLOR}»-collections. Behold kun én før du forbereder variablene.`,
      renamedCollection: false,
      renamedVariableCount: 0,
      hasSupportColor,
    };
  }

  if (mainColorCollections.length === 1 && colorCollections.length > 0) {
    return {
      status: 'error',
      message: `Både «${MAIN_COLOR}» og «${COLLECTION.COLOR}» finnes. Behold kun collectionen du vil oppdatere, og prøv igjen.`,
      renamedCollection: false,
      renamedVariableCount: 0,
      hasSupportColor,
    };
  }

  const targetCollection = mainColorCollections[0] || colorCollections[0];
  if (!targetCollection) {
    return {
      status: 'noop',
      message: `Fant ingen «${MAIN_COLOR}»- eller «${COLLECTION.COLOR}»-collection å forberede.`,
      renamedCollection: false,
      renamedVariableCount: 0,
      hasSupportColor,
    };
  }

  let renamedCollection = false;
  if (targetCollection.name === MAIN_COLOR) {
    targetCollection.name = COLLECTION.COLOR;
    renamedCollection = true;
  }

  let renamedVariableCount = 0;
  for (const variableId of targetCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable && variable.name.startsWith(VARIABLE_PREFIX)) {
      variable.name = variable.name.slice(VARIABLE_PREFIX.length);
      renamedVariableCount += 1;
    }
  }

  const changed = renamedCollection || renamedVariableCount > 0;
  if (changed) {
    // Make prime its own undo step so Cmd+Z reverses just the preparation.
    figma.commitUndo();
  }

  return {
    status: changed ? 'success' : 'noop',
    message: changed
      ? `Forberedte variabler: ga «${MAIN_COLOR}» nytt navn til «${COLLECTION.COLOR}» og oppdaterte ${renamedVariableCount} variabel${renamedVariableCount === 1 ? '' : 'er'}.`
      : 'Variablene var allerede forberedt.',
    renamedCollection,
    renamedVariableCount,
    hasSupportColor,
  };
}
