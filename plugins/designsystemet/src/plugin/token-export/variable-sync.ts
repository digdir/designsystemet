import type { CollectionSpec } from './collection-specs';

export async function syncCollections(
  specs: CollectionSpec[],
  logs: string[],
): Promise<Map<string, VariableCollection>> {
  const existingCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const collectionByName = new Map(
    existingCollections.map((item) => [item.name, item]),
  );
  const result = new Map<string, VariableCollection>();

  for (const spec of specs) {
    const collection =
      collectionByName.get(spec.name) ||
      figma.variables.createVariableCollection(spec.name);

    if (!collectionByName.has(spec.name)) {
      logs.push(`Created collection: ${spec.name}`);
    }

    await ensureModes(collection, spec.modeNames, logs);
    result.set(spec.name, collection);
  }

  return result;
}

async function ensureModes(
  collection: VariableCollection,
  desiredModeNames: string[],
  logs: string[],
): Promise<void> {
  if (desiredModeNames.length === 0) {
    return;
  }

  const existing = collection.modes.slice();

  if (existing.length === 1 && existing[0].name !== desiredModeNames[0]) {
    collection.renameMode(existing[0].modeId, desiredModeNames[0]);
    logs.push(
      `Renamed mode ${existing[0].name} -> ${desiredModeNames[0]} in ${collection.name}`,
    );
  }

  for (const modeName of desiredModeNames) {
    if (!collection.modes.some((mode) => mode.name === modeName)) {
      collection.addMode(modeName);
      logs.push(`Created mode ${modeName} in ${collection.name}`);
    }
  }

  for (const mode of collection.modes.slice()) {
    if (!desiredModeNames.includes(mode.name) && collection.modes.length > 1) {
      collection.removeMode(mode.modeId);
      logs.push(`Deleted mode ${mode.name} from ${collection.name}`);
    }
  }
}

export async function syncVariables(
  specs: CollectionSpec[],
  collectionMap: Map<string, VariableCollection>,
  logs: string[],
): Promise<Map<string, Variable>> {
  const allVariables = await figma.variables.getLocalVariablesAsync();
  const byCompositeKey = new Map<string, Variable>();
  const variablesByCollection = new Map<string, Map<string, Variable>>();

  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    if (!collection) {
      continue;
    }

    const existingInCollection = allVariables.filter(
      (variable) => variable.variableCollectionId === collection.id,
    );
    const variableByName = new Map(
      existingInCollection.map((item) => [item.name, item]),
    );

    for (const variable of existingInCollection) {
      const desired = spec.variables.get(variable.name);
      if (!desired) {
        variable.remove();
        logs.push(`Deleted variable ${collection.name}/${variable.name}`);
      }
    }

    const createdOrExisting = new Map<string, Variable>();

    for (const desired of spec.variables.values()) {
      let variable = variableByName.get(desired.name);

      if (variable && variable.resolvedType !== desired.type) {
        variable.remove();
        logs.push(
          `Deleted variable ${collection.name}/${desired.name} because type changed to ${desired.type}`,
        );
        variable = undefined;
      }

      if (!variable) {
        variable = figma.variables.createVariable(
          desired.name,
          collection,
          desired.type,
        );
        logs.push(`Created variable ${collection.name}/${desired.name}`);
      }

      createdOrExisting.set(desired.name, variable);
      byCompositeKey.set(`${collection.name}::${desired.name}`, variable);
    }

    variablesByCollection.set(spec.name, createdOrExisting);
  }

  // Raw values are set before aliases so that every alias target already exists
  // in Figma when the alias pass runs (Figma requires the target to exist first).
  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    const createdOrExisting = variablesByCollection.get(spec.name);
    if (!collection || !createdOrExisting) {
      continue;
    }

    const modeIdByName = new Map(
      collection.modes.map((mode) => [mode.name, mode.modeId]),
    );
    for (const desired of spec.variables.values()) {
      const variable = createdOrExisting.get(desired.name);
      if (!variable) {
        continue;
      }

      for (const [modeName, valueSpec] of desired.valuesByMode.entries()) {
        if (valueSpec.kind !== 'raw') {
          continue;
        }

        const modeId = modeIdByName.get(modeName);
        if (!modeId) {
          continue;
        }

        variable.setValueForMode(modeId, valueSpec.value);
      }
    }
  }

  for (const spec of specs) {
    const collection = collectionMap.get(spec.name);
    const createdOrExisting = variablesByCollection.get(spec.name);
    if (!collection || !createdOrExisting) {
      continue;
    }

    const modeIdByName = new Map(
      collection.modes.map((mode) => [mode.name, mode.modeId]),
    );
    for (const desired of spec.variables.values()) {
      const variable = createdOrExisting.get(desired.name);
      if (!variable) {
        continue;
      }

      for (const [modeName, valueSpec] of desired.valuesByMode.entries()) {
        if (valueSpec.kind !== 'alias') {
          continue;
        }

        const modeId = modeIdByName.get(modeName);
        const targetVariable = byCompositeKey.get(
          `${valueSpec.collection}::${valueSpec.name}`,
        );
        if (!modeId) {
          continue;
        }

        if (!targetVariable) {
          logs.push(
            `Missing alias target ${valueSpec.collection}/${valueSpec.name} for ${collection.name}/${desired.name}`,
          );
          continue;
        }

        variable.setValueForMode(
          modeId,
          figma.variables.createVariableAlias(targetVariable),
        );
      }
    }
  }

  return byCompositeKey;
}

export function findVariable(
  variableLookup: Map<string, Variable>,
  collectionName: string,
  variableName: string | null,
): Variable | null {
  if (!variableName) {
    return null;
  }

  return variableLookup.get(`${collectionName}::${variableName}`) || null;
}
