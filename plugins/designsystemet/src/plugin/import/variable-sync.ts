import type { CollectionSpec } from './collection-specs';
import { changedFields, type ImportLog } from './log';
import {
  isManaged,
  keptWarning,
  managedModeIds,
  markManaged,
  planModes,
  setManagedModeIds,
  splitLeftovers,
} from './ownership';
import type { Pause } from './pause';
import { normalizeScopes } from './scopes';

export async function syncCollections(
  specs: CollectionSpec[],
  log: ImportLog,
  pause: Pause,
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
      log.info.push(`Created collection: ${spec.name}`);
    }

    await ensureModes(collection, spec.modeNames, log, pause);
    result.set(spec.name, collection);
  }

  return result;
}

// Only modes the import created are renamed or deleted; see ownership.ts.
export async function ensureModes(
  collection: VariableCollection,
  desiredModeNames: string[],
  log: ImportLog,
  pause: Pause,
): Promise<void> {
  const previouslyManaged = managedModeIds(collection);
  const plan = planModes(collection.modes, desiredModeNames, previouslyManaged);
  const managed = new Set(plan.managed);
  // Saved after each change, together with the IDs saved before, so if a change fails part way (e.g. at
  // Figma's mode limit), every mode the import has made or renamed so far is still marked as its own.
  const saveManaged = () =>
    setManagedModeIds(collection, [...previouslyManaged, ...managed]);

  if (plan.rename) {
    collection.renameMode(plan.rename.mode.modeId, plan.rename.to);
    saveManaged();
    log.info.push(
      `Renamed mode ${plan.rename.mode.name} -> ${plan.rename.to} in ${collection.name}`,
    );
  }

  for (const modeName of plan.add) {
    managed.add(collection.addMode(modeName));
    saveManaged();
    log.info.push(`Created mode ${modeName} in ${collection.name}`);
    // Each new mode gets a value for every variable in the collection, so this can be slow.
    await pause(() => `Importing modes in ${collection.name}`);
  }

  for (const mode of plan.remove) {
    collection.removeMode(mode.modeId);
    log.info.push(`Deleted mode ${mode.name} from ${collection.name}`);
    await pause(() => `Importing modes in ${collection.name}`);
  }

  if (plan.keep.length > 0) {
    log.warnings.push(
      keptWarning(
        { one: 'mode', many: 'modes' },
        plan.keep.map((mode) => mode.name),
        collection.name,
      ),
    );
  }

  // Every change is done, so the IDs of removed modes can go.
  setManagedModeIds(collection, managed);
}

export async function syncVariables(
  specs: CollectionSpec[],
  collectionMap: Map<string, VariableCollection>,
  log: ImportLog,
  pause: Pause,
): Promise<Map<string, Variable>> {
  const allVariables = await figma.variables.getLocalVariablesAsync();
  // Counts for the progress label shown while the import pauses.
  const variableCount = specs.reduce(
    (sum, spec) => sum + spec.variables.size,
    0,
  );
  const aliasCount = specs.reduce(
    (sum, spec) =>
      sum +
      [...spec.variables.values()].reduce(
        (modes, variable) =>
          modes +
          [...variable.valuesByMode.values()].filter(
            (value) => value.kind === 'alias',
          ).length,
        0,
      ),
    0,
  );
  let variablesDone = 0;
  let aliasesDone = 0;
  const variablesDetail = () =>
    `Importing variables (${variablesDone} of ${variableCount})`;
  const aliasesDetail = () =>
    `Writing aliases (${aliasesDone} of ${aliasCount})`;
  const byCompositeKey = new Map<string, Variable>();
  const variablesByCollection = new Map<string, Map<string, Variable>>();
  const updateChecks: {
    variable: Variable;
    collection: VariableCollection;
    before: VariableSnapshot;
  }[] = [];

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

    // Only variables the import created are deleted; see ownership.ts.
    const leftovers = splitLeftovers(
      existingInCollection,
      new Set(spec.variables.keys()),
      { name: (variable) => variable.name, managed: isManaged },
    );
    for (const variable of leftovers.remove) {
      variable.remove();
      log.info.push(`Deleted variable ${collection.name}/${variable.name}`);
      await pause(variablesDetail);
    }
    if (leftovers.keep.length > 0) {
      log.warnings.push(
        keptWarning(
          { one: 'variable', many: 'variables' },
          leftovers.keep.map((variable) => variable.name),
          collection.name,
        ),
      );
    }

    const createdOrExisting = new Map<string, Variable>();
    const modeIdByName = new Map(
      collection.modes.map((mode) => [mode.name, mode.modeId]),
    );

    for (const desired of spec.variables.values()) {
      let variable = variableByName.get(desired.name);

      if (variable && variable.resolvedType !== desired.type) {
        // A variable made by hand is never replaced, so this one is left out of the import.
        if (!isManaged(variable)) {
          log.warnings.push(
            `Skipped variable ${collection.name}/${desired.name} because a variable with that name, made by hand, is a ${variable.resolvedType} and not a ${desired.type}`,
          );
          variablesDone++;
          continue;
        }
        variable.remove();
        log.info.push(
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
        log.info.push(`Created variable ${collection.name}/${desired.name}`);
      } else {
        // Snapshot existing variables before anything is written, so they can be logged as updated.
        updateChecks.push({
          variable,
          collection,
          before: snapshotVariable(variable, collection),
        });
      }

      // Scopes and code syntax are best-effort: Figma rejects some assignments (e.g. an invalid
      // scope combination), and that must not abort the import before values, aliases and
      // styles are written. Log the variable and carry on.
      try {
        syncCodeSyntax(variable, desired.codeSyntax);
      } catch (error) {
        log.warnings.push(
          `Could not set code syntax on ${collection.name}/${desired.name}: ${errorMessage(error)}`,
        );
      }
      try {
        syncScopes(variable, desired.scopes);
      } catch (error) {
        log.warnings.push(
          `Could not set scopes on ${collection.name}/${desired.name}: ${errorMessage(error)}`,
        );
      }

      // Raw values are written right away. Aliases wait for the pass below, as Figma needs
      // an alias's target to exist, and it may be a variable that isn't created yet.
      for (const [modeName, valueSpec] of desired.valuesByMode.entries()) {
        const modeId = modeIdByName.get(modeName);
        if (valueSpec.kind !== 'raw' || !modeId) {
          continue;
        }
        variable.setValueForMode(modeId, valueSpec.value);
        await pause(variablesDetail);
      }

      // Marks a new variable as the import's. An existing one with a name from the config, e.g. from an
      // import before marking existed, becomes the import's too, as it's updated from the config.
      markManaged(variable);
      createdOrExisting.set(desired.name, variable);
      byCompositeKey.set(`${collection.name}::${desired.name}`, variable);
      variablesDone++;
      await pause(variablesDetail);
    }

    variablesByCollection.set(spec.name, createdOrExisting);
  }

  // Every variable now exists, so aliases can be written.
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
          log.warnings.push(
            `Missing alias target ${valueSpec.collection}/${valueSpec.name} for ${collection.name}/${desired.name}`,
          );
          continue;
        }

        variable.setValueForMode(
          modeId,
          figma.variables.createVariableAlias(targetVariable),
        );
        aliasesDone++;
        await pause(aliasesDetail);
      }
    }
  }

  for (const { variable, collection, before } of updateChecks) {
    const changed = changedFields(
      before,
      snapshotVariable(variable, collection),
    );
    if (changed.length > 0) {
      log.info.push(
        `Updated variable ${collection.name}/${variable.name}: ${changed.join(', ')}`,
      );
    }
    await pause(() => 'Checking what changed');
  }

  return byCompositeKey;
}

type VariableSnapshot = Record<string, unknown>;

// The parts of a variable the import writes, keyed by how they are named in the log.
function snapshotVariable(
  variable: Variable,
  collection: VariableCollection,
): VariableSnapshot {
  const snapshot: VariableSnapshot = {
    'code syntax': variable.codeSyntax.WEB ?? null,
    scopes: variable.scopes,
  };
  for (const mode of collection.modes) {
    snapshot[`value in ${mode.name}`] = variable.valuesByMode[mode.modeId];
  }
  return snapshot;
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

// Keeps the WEB code syntax equal to the CSS property the token is built as. Idempotent, so an
// unchanged variable is left alone and a variable that lost its CSS property has the syntax removed.
function syncCodeSyntax(variable: Variable, expected: string | null): void {
  const current = variable.codeSyntax.WEB?.trim() || null;
  if (current === expected) {
    return;
  }
  if (expected) {
    variable.setVariableCodeSyntax('WEB', expected);
  } else {
    variable.removeVariableCodeSyntax('WEB');
  }
}

// Keeps the scopes equal to the spec. Idempotent, so an unchanged variable is left alone.
function syncScopes(variable: Variable, expected: VariableScope[]): void {
  if (normalizeScopes(expected) === normalizeScopes(variable.scopes ?? [])) {
    return;
  }
  variable.scopes = expected;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
