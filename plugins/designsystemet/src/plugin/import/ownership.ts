// What the import created. Variables and styles it creates are marked with plugin data, and the IDs of the
// modes it creates are stored on their collection, as modes can't hold plugin data. Later imports only delete
// or rename what is marked, so modes, variables and styles added by hand are kept (issue #5470).
//
// Files imported into before marking existed have no marks. Items in them whose names match the config are
// marked when the import updates them; the rest are kept and reported, as they can't be shown to be the
// plugin's.

// Plugin data is private to this plugin, so the keys only need to be unique within it.
const MANAGED_KEY = 'managed';
const MODES_KEY = 'modes';
// The mode Figma gives a new collection.
const FIGMA_DEFAULT_MODE = 'Mode 1';

type PluginDataItem = Pick<PluginDataMixin, 'getPluginData' | 'setPluginData'>;
type Mode = { modeId: string; name: string };

/** Whether the import created this variable or style, or took it over from an earlier import. */
export function isManaged(item: PluginDataItem): boolean {
  return item.getPluginData(MANAGED_KEY) === '1';
}

export function markManaged(item: PluginDataItem): void {
  if (!isManaged(item)) {
    item.setPluginData(MANAGED_KEY, '1');
  }
}

/** The IDs of the collection's modes the import created. */
export function managedModeIds(collection: PluginDataItem): Set<string> {
  try {
    const ids: unknown = JSON.parse(
      collection.getPluginData(MODES_KEY) || '[]',
    );
    return new Set(
      Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [],
    );
  } catch {
    return new Set();
  }
}

export function setManagedModeIds(
  collection: PluginDataItem,
  ids: Iterable<string>,
): void {
  collection.setPluginData(MODES_KEY, JSON.stringify([...new Set(ids)]));
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
 * of a collection is renamed instead of replaced, so values and layers using it are kept, but only when it's
 * Figma's default mode or one the import created.
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
    (only.name === FIGMA_DEFAULT_MODE || managedIds.has(only.modeId))
  ) {
    plan.rename = { mode: only, to: desired[0] };
    names.set(only.modeId, desired[0]);
  }

  const existingNames = new Set(names.values());
  plan.add = desired.filter((name) => !existingNames.has(name));

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
