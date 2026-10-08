// What the import created. Variables and styles it creates are marked with plugin data, and the IDs of the
// modes it creates are stored on their collection, as modes can't hold plugin data. Later imports only delete
// or rename what is marked, so modes, variables and styles added by hand are kept (issue #5470).
//
// Files imported into before marking existed have no marks. Items in them whose names match the config are
// marked when the import updates them; the rest are kept and reported, as they can't be shown to be the
// plugin's.

import pkg from '../../../package.json';

/**
 * What the import stores on a variable, style or collection, as JSON under one plugin data key. More fields can be
 * added later (e.g. the CSS variable a variable is built as) without new keys. Fields are only ever added: a file
 * keeps what other plugin versions wrote, so readers check each field and writers keep fields they don't know.
 */
export type ImportData = {
  /**
   * The version of the plugin that last wrote the item. Set on every write, so a variable or style that has it
   * was created by the import, or taken over from an earlier import.
   */
  pluginVersion?: string;
  /** On collections: the IDs of the modes the import created, as modes can't hold plugin data. */
  modes?: string[];
};

// Plugin data is private to this plugin, so the key only needs to be unique within it.
const DATA_KEY = 'import';

type PluginDataItem = Pick<PluginDataMixin, 'getPluginData' | 'setPluginData'>;
type Mode = { modeId: string; name: string };

/** The import's data on an item. Empty if it has none, or if it can't be read. */
export function readImportData(item: PluginDataItem): ImportData {
  try {
    const data: unknown = JSON.parse(item.getPluginData(DATA_KEY) || '{}');
    return typeof data === 'object' && data !== null && !Array.isArray(data)
      ? (data as ImportData)
      : {};
  } catch {
    return {};
  }
}

/**
 * Adds fields to the import's data on an item, and stamps it with this plugin's version. Fields that aren't
 * given are kept, including ones written by other plugin versions. Nothing is written if nothing changed.
 */
export function updateImportData(
  item: PluginDataItem,
  fields: ImportData,
): void {
  const json = JSON.stringify({
    ...readImportData(item),
    ...fields,
    pluginVersion: pkg.version,
  });
  if (json !== item.getPluginData(DATA_KEY)) {
    item.setPluginData(DATA_KEY, json);
  }
}

/** Whether the import created this variable or style, or took it over from an earlier import. */
export function isManaged(item: PluginDataItem): boolean {
  return typeof readImportData(item).pluginVersion === 'string';
}

/** Marks a variable or style as the import's, by writing its data, which stamps the plugin version. */
export function markManaged(item: PluginDataItem): void {
  updateImportData(item, {});
}

/** The IDs of the collection's modes the import created. */
export function managedModeIds(collection: PluginDataItem): Set<string> {
  const { modes } = readImportData(collection);
  return new Set(
    Array.isArray(modes) ? modes.filter((id) => typeof id === 'string') : [],
  );
}

export function setManagedModeIds(
  collection: PluginDataItem,
  ids: Iterable<string>,
): void {
  updateImportData(collection, { modes: [...new Set(ids)] });
}

export type ModePlan = {
  /** The collection's only mode, renamed to the first mode in the config. */
  rename?: { mode: Mode; to: string };
  /** Mode names to add, in config order. */
  add: string[];
  /** Modes the import created that aren't in the config any more. */
  remove: Mode[];
  /** Modes that aren't in the config, but weren't created by the import. */
  keep: Mode[];
  /** Existing modes the import now manages: the ones in the config, including a renamed mode. */
  managed: string[];
};

/**
 * How to make a collection's modes match the config. Only modes the import created are removed. The only mode
 * of a collection is renamed instead of replaced, so values and layers using it are kept, but only when the import
 * created it, e.g. the mode Figma gives a collection the import creates. A mode made by hand is never renamed,
 * even one called "Mode 1" in a collection made by hand with a name from the config.
 */
export function planModes(
  existing: Mode[],
  desired: string[],
  managedIds: Set<string>,
): ModePlan {
  const plan: ModePlan = { add: [], remove: [], keep: [], managed: [] };
  if (desired.length === 0) {
    return plan;
  }

  const names = new Map(existing.map((mode) => [mode.modeId, mode.name]));
  const [only] = existing;
  if (
    existing.length === 1 &&
    !desired.includes(only.name) &&
    managedIds.has(only.modeId)
  ) {
    plan.rename = { mode: only, to: desired[0] };
    names.set(only.modeId, desired[0]);
  }

  const existingNames = new Set(names.values());
  // Without duplicates, as a mode name the config lists twice is still one mode.
  plan.add = [...new Set(desired)].filter((name) => !existingNames.has(name));

  for (const mode of existing) {
    const name = names.get(mode.modeId) ?? mode.name;
    if (desired.includes(name)) {
      plan.managed.push(mode.modeId);
    } else if (managedIds.has(mode.modeId)) {
      plan.remove.push(mode);
    } else {
      plan.keep.push(mode);
    }
  }

  return plan;
}

/**
 * Splits the existing items that aren't in the config into the ones the import created, which are removed,
 * and the ones it didn't, which are kept.
 */
export function splitLeftovers<T>(
  existing: T[],
  desiredNames: Set<string>,
  {
    name,
    managed,
  }: { name: (item: T) => string; managed: (item: T) => boolean },
): { remove: T[]; keep: T[] } {
  const leftovers = existing.filter((item) => !desiredNames.has(name(item)));
  return {
    remove: leftovers.filter(managed),
    keep: leftovers.filter((item) => !managed(item)),
  };
}

/** A warning listing kept items, e.g. "Kept 2 variables in Theme that aren't in the config …: a, b". */
export function keptWarning(
  kind: { one: string; many: string },
  names: string[],
  place?: string,
): string {
  const one = names.length === 1;
  return `Kept ${names.length} ${one ? kind.one : kind.many}${place ? ` in ${place}` : ''} that ${one ? "isn't" : "aren't"} in the config and ${one ? "wasn't" : "weren't"} created by this plugin: ${names.join(', ')}`;
}
