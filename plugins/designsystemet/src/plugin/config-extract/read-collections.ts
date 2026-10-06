import type { ValueSpec } from '../config-sync/collection-specs';
import type { CollectionData } from './types';

/**
 * Reads the file's local variable collections as plain data for `extractConfig`. Values are keyed by
 * mode name, and aliases name their target by collection and variable name. Aliases to variables
 * outside the file (e.g. from a library) are left out, since the config can't refer to them.
 */
export async function readCollections(): Promise<CollectionData[]> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();

  const collectionById = new Map(collections.map((c) => [c.id, c]));
  const variableById = new Map(variables.map((v) => [v.id, v]));

  const toValueSpec = (value: VariableValue): ValueSpec | null => {
    if (!isAlias(value)) {
      return { kind: 'raw', value };
    }
    const target = variableById.get(value.id);
    const targetCollection =
      target && collectionById.get(target.variableCollectionId);
    return target && targetCollection
      ? { kind: 'alias', collection: targetCollection.name, name: target.name }
      : null;
  };

  return collections.map((collection) => {
    const modeNameById = new Map(
      collection.modes.map((mode) => [mode.modeId, mode.name]),
    );

    return {
      name: collection.name,
      modes: collection.modes.map((mode) => mode.name),
      variables: variables
        .filter((variable) => variable.variableCollectionId === collection.id)
        .map((variable) => {
          const valuesByMode: Record<string, ValueSpec> = {};
          for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
            const modeName = modeNameById.get(modeId);
            const spec = toValueSpec(value);
            if (modeName && spec) {
              valuesByMode[modeName] = spec;
            }
          }
          return { name: variable.name, valuesByMode };
        }),
    };
  });
}

function isAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'VARIABLE_ALIAS'
  );
}
