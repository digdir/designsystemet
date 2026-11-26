// Rebinds the color variables on layers in UI kit components, following a migration's rules.
//
// The components are found by page and name, as in the UI kit. Each layer's fills, strokes and text colors are
// passed to the rules, which say which variable to use instead, if any. Main components are changed first,
// and then what's left in the instances inside them. A layer in an instance of a target component follows the
// change unless it was overridden, so only its overrides are left to change. Layers in instances of other
// components, e.g. text from Typography in Dialog, are changed in place, which overrides them there.

import { componentName, pageStamp, pageTitle } from '../stamps/stamps';
import type { MigrationContext, MigrationLog, VariableRef } from './types';

/** A component or component set in the UI kit, by its page and name. */
export type ComponentTarget = {
  page: string;
  name: string;
};

/** Where a layer is: the target component, the variant it's in, and its path below the variant. */
export type LayerContext = {
  /** The page the target component is on, as the migration names it, e.g. `Checkbox`. Rules use it. */
  page: string;
  /**
   * How the preview names the page, when the file's page has another name than the migration's, e.g.
   * `Dialog (page ‘Modal’)`. Changes are grouped by it, or by `page` when it's left out.
   */
  pageLabel?: string;
  component: string;
  /** The variant's name, e.g. `state=read-only`, or '' for a component that isn't a set. */
  variant: string;
  /** The names of the layers from the variant down, e.g. `/field/prefix/text`. '' for the variant itself. */
  path: string;
};

export type PaintProperty = 'fill' | 'stroke' | 'text';

export type PaintContext = LayerContext & {
  property: PaintProperty;
  /** The variable the paint is bound to. */
  variable: VariableRef;
};

/** The variable a paint should use instead, `'remove'` to remove the paint, or null to leave it. */
export type PaintTarget = VariableRef | 'remove' | null;

export type RebindRules = {
  paint: (context: PaintContext) => PaintTarget;
  /** The variable to bind a solid paint without one to, e.g. a hard-coded hex, or null to leave it. */
  unboundPaint?: (
    context: LayerContext & { property: PaintProperty; hex: string },
  ) => VariableRef | null;
  /** Whether to clear a layer's explicit mode for a collection, e.g. a mode that made it neutral. */
  clearMode?: (
    context: LayerContext & { collection: string; mode: string },
  ) => boolean;
  /** Layers to leave alone, with everything in them. */
  skip?: (node: SceneNode) => boolean;
};

type Root = {
  target: ComponentTarget;
  node: ComponentNode | ComponentSetNode;
  /** Set when the component was found on a page with another name than the migration's. */
  pageLabel?: string;
};

/** A change to one paint: what it was bound to, and what it's bound to now (or `removed`). */
type PaintChange = { property: PaintProperty; from: string; to: string };

/** Rebinds the paints in the target components. In a dry run, only logs what would change. */
export async function rebindComponents(
  targets: ComponentTarget[],
  rules: RebindRules,
  context: MigrationContext,
): Promise<void> {
  const { dryRun, log, pause } = context;
  const variables = await createVariableIndex();
  const roots = await findComponents(targets, log);
  const fonts = createFontLoader();
  const overrides = createOverrideIndex();
  const warn = createWarn(log);

  // The variables each changed layer used before, by layer ID and property. In a dry run nothing changes, so a
  // layer in an instance still looks like the layer it comes from. If they match and the instance layer isn't
  // overridden, it changes with that layer when applied, so it isn't counted again.
  const changedLayers = new Map<string, string>();

  // The paints with the rules applied, and what changed, or null if nothing did.
  const rebindPaints = async (
    paints: readonly Paint[],
    layer: LayerContext,
    property: PaintProperty,
  ): Promise<{ paints: Paint[]; changes: PaintChange[] } | null> => {
    const result: Paint[] = [];
    const changes: PaintChange[] = [];
    for (const paint of paints) {
      const id =
        paint.type === 'SOLID' ? paint.boundVariables?.color?.id : undefined;
      if (paint.type === 'SOLID' && !id && rules.unboundPaint) {
        const hex = toHex(paint.color);
        const target = rules.unboundPaint({ ...layer, property, hex });
        const replacement = target && variables.find(target);
        if (target && !replacement) {
          warn(
            `${refName(target)} is missing, so layers using ${hex} were left as they are.`,
          );
        }
        if (target && replacement) {
          changes.push({ property, from: hex, to: describeVariable(target) });
          result.push(
            figma.variables.setBoundVariableForPaint(
              paint,
              'color',
              replacement,
            ),
          );
          continue;
        }
      }
      const variable = id ? await variables.resolve(id) : null;
      const target = variable
        ? rules.paint({ ...layer, property, variable })
        : null;
      if (
        !variable ||
        !target ||
        (target !== 'remove' && sameRef(target, variable))
      ) {
        result.push(paint);
        continue;
      }
      if (target === 'remove') {
        changes.push({
          property,
          from: describeVariable(variable),
          to: 'removed',
        });
        continue;
      }
      const replacement = variables.find(target);
      if (!replacement) {
        warn(
          `${refName(target)} is missing, so layers using ${refName(variable)} were left as they are.`,
        );
        result.push(paint);
        continue;
      }
      changes.push({
        property,
        from: describeVariable(variable),
        to: describeVariable(target),
      });
      result.push(
        figma.variables.setBoundVariableForPaint(
          paint as SolidPaint,
          'color',
          replacement,
        ),
      );
    }
    return changes.length > 0 ? { paints: result, changes } : null;
  };

  const count = (layer: LayerContext, changes: PaintChange[]) => {
    for (const { property, from, to } of changes) {
      countChange(log, layer.pageLabel ?? layer.page, property, from, to);
    }
  };

  // Rebinds a layer's fills (text colors for text) or strokes. Changes are counted once they're made, or in a
  // dry run once they could be. Returns whether anything changed.
  const rebindProperty = async (
    node: SceneNode,
    layer: LayerContext,
    property: 'fill' | 'stroke',
  ): Promise<boolean> => {
    if (property === 'stroke') {
      if (!('strokes' in node)) return false;
      const strokes = await rebindPaints(node.strokes, layer, 'stroke');
      if (!strokes) return false;
      if (!dryRun) node.strokes = strokes.paints;
      count(layer, strokes.changes);
      return true;
    }
    if (!('fills' in node)) return false;
    if (node.type !== 'TEXT') {
      if (node.fills === figma.mixed) return false;
      const fills = await rebindPaints(node.fills, layer, 'fill');
      if (!fills) return false;
      if (!dryRun) node.fills = fills.paints;
      count(layer, fills.changes);
      return true;
    }
    // Text can have different colors in different ranges.
    const updates: Array<{ start: number; end: number; paints: Paint[] }> = [];
    const changes: PaintChange[] = [];
    for (const segment of node.getStyledTextSegments(['fills'])) {
      const fills = await rebindPaints(segment.fills, layer, 'text');
      if (!fills) continue;
      updates.push({
        start: segment.start,
        end: segment.end,
        paints: fills.paints,
      });
      changes.push(...fills.changes);
    }
    if (updates.length === 0) return false;
    // Text can only be changed with its fonts loaded. Loading changes nothing, so a dry run checks it too.
    const missingFont = await fonts.load(node);
    if (missingFont) {
      warn(
        `Skipped text in ${layer.component}, as the font ${missingFont} isn't available.`,
      );
      return false;
    }
    if (!dryRun) {
      for (const { start, end, paints } of updates) {
        node.setRangeFills(start, end, paints);
      }
    }
    count(layer, changes);
    return true;
  };

  const rebindLayer = async (node: SceneNode, layer: LayerContext) => {
    for (const property of ['fill', 'stroke'] as const) {
      const signature = paintSignature(node, property);
      if (!signature) continue;
      if (dryRun && followsChangedLayer(node, property, signature)) continue;
      if (await rebindProperty(node, layer, property)) {
        changedLayers.set(`${node.id}|${property}`, signature);
      }
    }
  };

  // Whether a layer in an instance will change with a layer it comes from, which this run changes. Follows the
  // chain of layers back to the main component, as a layer in between may have been skipped for following too,
  // e.g. text in Dialog's instance of _Content, which follows _Content's Paragraph, which follows Paragraph.
  const followsChangedLayer = (
    node: SceneNode,
    property: 'fill' | 'stroke',
    signature: string,
  ): boolean => {
    for (
      let source = sourceLayerId(node.id);
      source !== null;
      source = sourceLayerId(source)
    ) {
      if (changedLayers.get(`${source}|${property}`) === signature) {
        return !overrides.isOverridden(node, property);
      }
    }
    return false;
  };

  const clearModes = async (node: SceneNode, layer: LayerContext) => {
    const modes = node.explicitVariableModes;
    for (const [collectionId, modeId] of Object.entries(modes)) {
      const collection =
        await figma.variables.getVariableCollectionByIdAsync(collectionId);
      const mode = collection?.modes.find((m) => m.modeId === modeId);
      if (!collection || !mode) continue;
      if (
        !rules.clearMode?.({
          ...layer,
          collection: collection.name,
          mode: mode.name,
        })
      )
        continue;
      countChange(
        log,
        layer.pageLabel ?? layer.page,
        'mode',
        `${collection.name} ${mode.name}`,
        'inherited',
      );
      if (!dryRun) node.clearExplicitVariableModeForCollection(collection);
    }
  };

  // First the layers in the main components, collecting the layers in instances for afterwards.
  const inInstances: Array<{ node: SceneNode; layer: LayerContext }> = [];
  const visitLayer = async (
    node: SceneNode,
    layer: LayerContext,
    inInstance: boolean,
  ) => {
    if (rules.skip?.(node)) return;
    if (inInstance) {
      inInstances.push({ node, layer });
    } else {
      await rebindLayer(node, layer);
      if (rules.clearMode) await clearModes(node, layer);
    }
    if ('children' in node) {
      for (const child of node.children) {
        await visitLayer(
          child,
          { ...layer, path: `${layer.path}/${child.name}` },
          inInstance || node.type === 'INSTANCE',
        );
      }
    }
    await pause();
  };

  for (const { target, node, pageLabel } of roots) {
    const variants = node.type === 'COMPONENT_SET' ? node.children : [node];
    for (const variant of variants) {
      await visitLayer(
        variant,
        {
          page: target.page,
          ...(pageLabel && { pageLabel }),
          component: target.name.trim(),
          variant: node.type === 'COMPONENT_SET' ? variant.name : '',
          path: '',
        },
        false,
      );
    }
  }

  // Then the layers in instances. Shallow ones first, so a layer nested deeper is handled after the layer it
  // comes from, e.g. one in an instance of _Header in Dialog after the same layer in _Header itself.
  const depth = (node: SceneNode) => node.id.split(';').length;
  inInstances.sort((a, b) => depth(a.node) - depth(b.node));
  for (const { node, layer } of inInstances) {
    await rebindLayer(node, layer);
    await pause();
  }
}

/**
 * Finds the target components in the file. Logs a warning for each one that isn't there.
 *
 * A page is found by its stamp (see stamps.ts), or else by its name, as the migration names it. People may rename
 * pages in a copy of the UI kit made before it was stamped, so a page that isn't found either way is looked for by
 * what's on it: the page with the most of its components, see `matchPagesByComponents`. For that, the pages not
 * found are loaded, which can be slow in a file with large designs of its own, so it's only done when a page is
 * missing. On a page, components are found by their stamp, or else by their name.
 */
export async function findComponents(
  targets: ComponentTarget[],
  log: MigrationLog,
): Promise<Root[]> {
  const warn = createWarn(log);
  const pageNames = [...new Set(targets.map((target) => target.page))];

  // The components on each page searched, so no page is searched twice.
  const searched = new Map<PageNode, Array<ComponentNode | ComponentSetNode>>();
  const componentsOn = async (page: PageNode) => {
    let components = searched.get(page);
    if (!components) {
      await page.loadAsync();
      components = topLevelComponents(page);
      searched.set(page, components);
    }
    return components;
  };

  // The pages to search for each of the migration's pages, by stamp or name, see `pagesFor`.
  const found = new Map<string, Array<{ page: PageNode; label?: string }>>();
  const labelled = (pageName: string, page: PageNode) =>
    normalizePageName(page.name) === normalizePageName(pageName)
      ? { page }
      : { page, label: `${pageName} (page ‘${pageTitle(page.name)}’)` };
  for (const pageName of pageNames) {
    const pages = pagesFor(pageName);
    if (pages.length > 0) {
      found.set(
        pageName,
        pages.map((page) => labelled(pageName, page)),
      );
    }
  }

  // Then by their components, among the pages that weren't found. Only these are loaded for it.
  const missing = pageNames.filter((pageName) => !found.has(pageName));
  if (missing.length > 0) {
    const foundByName = new Set(
      [...found.values()].flat().map(({ page }) => page),
    );
    const candidates = figma.root.children.filter(
      (page) => !foundByName.has(page),
    );
    const names: Array<Set<string>> = [];
    for (const page of candidates) {
      const components = await componentsOn(page);
      names.push(new Set(components.map(componentName)));
    }
    const matches = matchPagesByComponents(targets, missing, names);
    for (const [pageName, indexes] of matches) {
      found.set(
        pageName,
        indexes.map((index) => labelled(pageName, candidates[index])),
      );
    }
  }

  const roots: Root[] = [];
  // A component on a page that matches several of the migration's pages is only changed once, by the first.
  const seen = new Set<string>();
  for (const pageName of pageNames) {
    const onPage = targets.filter((target) => target.page === pageName);
    const pages = found.get(pageName);
    if (!pages) {
      warn(
        `Could not find the page ${pageName}, so its components were left as they are: ${onPage.map((t) => t.name.trim()).join(', ')}.`,
      );
      continue;
    }
    const where = pages.some(({ label }) => label)
      ? `for ${pageName}, on the page ${pages.map(({ page }) => `‘${pageTitle(page.name)}’`).join(' or ')}`
      : `on the page ${pageName}`;
    for (const target of onPage) {
      let foundAny = false;
      for (const { page, label } of pages) {
        for (const node of await componentsOn(page)) {
          if (componentName(node) !== target.name.trim()) continue;
          foundAny = true;
          if (seen.has(node.id)) continue;
          seen.add(node.id);
          roots.push({ target, node, ...(label && { pageLabel: label }) });
        }
      }
      if (!foundAny) {
        warn(
          `Could not find the component ${target.name.trim()} ${where}, so it was left as it is.`,
        );
      }
    }
  }
  return roots;
}

/**
 * The pages for one of a migration's pages: the pages stamped as it, or else the pages with its name that aren't
 * stamped as another page. Doesn't load the pages. Stamps and names are compared the same way, without symbols or
 * case, e.g. `Avatar Stack` is `Avatar stack`.
 */
function pagesFor(pageName: string): PageNode[] {
  const name = normalizePageName(pageName);
  const stamped = figma.root.children.filter(
    (page) => normalizePageName(pageStamp(page)) === name,
  );
  return stamped.length > 0
    ? stamped
    : figma.root.children.filter(
        (page) => !pageStamp(page) && normalizePageName(page.name) === name,
      );
}

/**
 * Whether the file has any of these UI kit pages, found by stamp or name. Doesn't load the pages. Pages renamed
 * in a copy made before the UI kit was stamped aren't counted, as finding them means loading every page.
 */
export function hasAnyPage(pageNames: string[]): boolean {
  return pageNames.some((pageName) => pagesFor(pageName).length > 0);
}

/** The component sets and the components that aren't variants on a page, which must be loaded. */
function topLevelComponents(
  page: PageNode,
): Array<ComponentNode | ComponentSetNode> {
  return page
    .findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
    .filter(
      (node) =>
        node.type === 'COMPONENT_SET' || node.parent?.type !== 'COMPONENT_SET',
    );
}

/**
 * For each of the migration's pages that wasn't found by name, the pages in the file that hold its components,
 * by their index in `pages` (the component names on each page). A page qualifies when it has at least half of
 * the components the migration lists for that page, including one that no other page in the migration lists,
 * so that names used on several pages, like `_Header` in Dialog and Card, can't match on their own. The pages
 * with the most components win; when several have as many, e.g. a duplicated page, all of them are used.
 */
export function matchPagesByComponents(
  targets: ComponentTarget[],
  pageNames: string[],
  pages: Array<Set<string>>,
): Map<string, number[]> {
  const namesByPage = new Map<string, Set<string>>();
  for (const { page, name } of targets) {
    const names = namesByPage.get(page) ?? new Set<string>();
    names.add(name.trim());
    namesByPage.set(page, names);
  }
  const matches = new Map<string, number[]>();
  for (const pageName of pageNames) {
    const names = [...(namesByPage.get(pageName) ?? [])];
    const unique = names.filter((name) =>
      [...namesByPage].every(
        ([other, otherNames]) => other === pageName || !otherNames.has(name),
      ),
    );
    const needed = Math.ceil(names.length / 2);
    let best = 0;
    let indexes: number[] = [];
    pages.forEach((onPage, index) => {
      const score = names.filter((name) => onPage.has(name)).length;
      if (score < needed || !unique.some((name) => onPage.has(name))) return;
      if (score > best) {
        best = score;
        indexes = [index];
      } else if (score === best) {
        indexes.push(index);
      }
    });
    if (indexes.length > 0) matches.set(pageName, indexes);
  }
  return matches;
}

/** Page names in the UI kit start with symbols, e.g. `❖  Dialog`. Compares the words only. */
export function normalizePageName(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();
}

/** Looks up variables by ID (local or from a library) and local variables by collection and name. */
export async function createVariableIndex() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collectionNames = new Map(collections.map((c) => [c.id, c.name]));
  const local = new Map<string, Variable>();
  for (const variable of await figma.variables.getLocalVariablesAsync()) {
    const collection = collectionNames.get(variable.variableCollectionId);
    if (collection)
      local.set(refName({ collection, name: variable.name }), variable);
  }

  const resolved = new Map<string, VariableRef | null>();
  return {
    find: (ref: VariableRef): Variable | undefined => local.get(refName(ref)),
    resolve: async (id: string): Promise<VariableRef | null> => {
      if (!resolved.has(id)) {
        const variable = await figma.variables.getVariableByIdAsync(id);
        const collection =
          variable &&
          (collectionNames.get(variable.variableCollectionId) ??
            (
              await figma.variables.getVariableCollectionByIdAsync(
                variable.variableCollectionId,
              )
            )?.name);
        resolved.set(
          id,
          variable && collection ? { collection, name: variable.name } : null,
        );
      }
      return resolved.get(id) ?? null;
    },
  };
}

export const refName = (ref: VariableRef): string =>
  `${ref.collection}/${ref.name}`;

const sameRef = (a: VariableRef, b: VariableRef): boolean =>
  a.collection === b.collection && a.name === b.name;

const WHAT: Record<PaintProperty | 'mode', string> = {
  fill: 'Fill',
  stroke: 'Border',
  text: 'Text',
  mode: 'Color mode',
};

/** Counts one more layer with this change, in the component that the page holds. */
function countChange(
  log: MigrationLog,
  page: string,
  property: PaintProperty | 'mode',
  from: string,
  to: string,
): void {
  const what = WHAT[property];
  const key = [page, what, from, to].join('|');
  const change = log.changes.get(key) ?? {
    page,
    what,
    from,
    to,
    count: 0,
  };
  change.count += 1;
  log.changes.set(key, change);
}

/**
 * A variable's name in a summary. Semantic colors are named by color and step (`neutral border-subtle`), and
 * variables in the Color collection, which follow the component's color, by step only (`border-muted`).
 */
export function describeVariable(ref: VariableRef): string {
  const semanticColor = /^color\/([^/]+)\/(.+)$/.exec(ref.name);
  if (ref.collection === 'Semantic' && semanticColor) {
    return `${semanticColor[1]} ${semanticColor[2]}`;
  }
  if (ref.collection === 'Color') return ref.name;
  return refName(ref);
}

function createWarn(log: MigrationLog): (warning: string) => void {
  return (warning) => {
    if (!log.warnings.includes(warning)) log.warnings.push(warning);
  };
}

/** A paint's color as hex, e.g. `#262626`. */
function toHex({ r, g, b }: RGB): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/**
 * The IDs of the variables a layer's fills or strokes are bound to, and the hex of solid paints without one, or
 * '' if it has neither. Two layers with the same signature have the same paints, as far as a migration can tell.
 */
function paintSignature(node: SceneNode, property: 'fill' | 'stroke'): string {
  let paints: readonly Paint[] = [];
  if (property === 'stroke' && 'strokes' in node) {
    paints = node.strokes;
  } else if (property === 'fill' && 'fills' in node) {
    paints =
      node.fills !== figma.mixed
        ? node.fills
        : node.type === 'TEXT'
          ? node
              .getStyledTextSegments(['fills'])
              .flatMap((segment) => segment.fills)
          : [];
  }
  // Variable IDs, or the hex of a solid paint without one, which a rule can bind.
  const ids = paints.map((paint) =>
    paint.type === 'SOLID'
      ? (paint.boundVariables?.color?.id ?? toHex(paint.color))
      : '',
  );
  return ids.some(Boolean) ? ids.join(',') : '';
}

/**
 * The ID of the layer a layer in an instance comes from, one level down: the same layer in the instance's main
 * component. `I1:2;3:4` comes from `3:4`, and `I1:2;3:4;5:6` from `I3:4;5:6`. Null for a layer not in an instance.
 */
export function sourceLayerId(id: string): string | null {
  if (!id.startsWith('I')) return null;
  const parts = id.slice(1).split(';');
  if (parts.length < 2) return null;
  return parts.length === 2 ? parts[1] : `I${parts.slice(1).join(';')}`;
}

/** Whether a layer's fills or strokes were overridden in one of the instances it's in. */
function createOverrideIndex() {
  const byInstance = new Map<string, Map<string, Set<string>>>();
  const fieldsOf = (instance: InstanceNode) => {
    let fields = byInstance.get(instance.id);
    if (!fields) {
      fields = new Map(
        (instance.overrides ?? []).map(({ id, overriddenFields }) => [
          id,
          new Set<string>(overriddenFields),
        ]),
      );
      byInstance.set(instance.id, fields);
    }
    return fields;
  };
  return {
    isOverridden: (node: SceneNode, property: 'fill' | 'stroke'): boolean => {
      const field = property === 'fill' ? 'fills' : 'strokes';
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (
          parent.type === 'INSTANCE' &&
          fieldsOf(parent).get(node.id)?.has(field)
        ) {
          return true;
        }
      }
      return false;
    },
  };
}

function createFontLoader() {
  const loaded = new Set<string>();
  const missing = new Set<string>();
  /** Loads the fonts in a text layer. Returns the name of a font that can't be loaded, if any. */
  return {
    load: async (node: TextNode): Promise<string | null> => {
      if (node.characters.length === 0) return null;
      for (const font of node.getRangeAllFontNames(0, node.characters.length)) {
        const key = `${font.family} ${font.style}`;
        if (missing.has(key)) return key;
        if (loaded.has(key)) continue;
        try {
          await figma.loadFontAsync(font);
          loaded.add(key);
        } catch {
          missing.add(key);
          return key;
        }
      }
      return null;
    },
  };
}
