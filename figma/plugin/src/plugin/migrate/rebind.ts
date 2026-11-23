// Rebinds the color variables on layers in UI kit components, following a migration's rules.
//
// The components are found by page and name, as in the UI kit. Each layer's fills, strokes and text colors are
// passed to the rules, which say which variable to use instead, if any. Main components are changed first,
// and then what's left in the instances inside them: a layer in an instance follows its main component unless
// it was overridden, so only overrides need changing there.

import type { MigrationContext, MigrationLog, VariableRef } from './types';

/** A component or component set in the UI kit, by its page and name. */
export type ComponentTarget = {
  page: string;
  name: string;
};

/** Where a layer is: the target component, the variant it's in, and its path below the variant. */
export type LayerContext = {
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
};

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
  const warn = createWarn(log);

  // In a dry run nothing changes, so layers in instances still look like their main components'. Remember
  // what would change in the main components, so the layers that follow them aren't counted twice.
  const plannedInMain = new Map<string, string>();

  const rebindPaints = async (
    paints: readonly Paint[],
    layer: LayerContext,
    property: PaintProperty,
  ): Promise<Paint[] | null> => {
    let changed = false;
    const result: Paint[] = [];
    for (const paint of paints) {
      const id =
        paint.type === 'SOLID' ? paint.boundVariables?.color?.id : undefined;
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
        countChange(
          log,
          layer.component,
          property,
          describeVariable(variable),
          'removed',
        );
        changed = true;
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
      countChange(
        log,
        layer.component,
        property,
        describeVariable(variable),
        describeVariable(target),
      );
      changed = true;
      result.push(
        figma.variables.setBoundVariableForPaint(
          paint as SolidPaint,
          'color',
          replacement,
        ),
      );
    }
    return changed ? result : null;
  };

  const visitLayer = async (
    node: SceneNode,
    layer: LayerContext,
    inInstance: boolean,
    pass: 'main' | 'instances',
  ) => {
    if (rules.skip?.(node)) return;

    if ((pass === 'main') !== inInstance) {
      for (const property of ['fill', 'stroke'] as const) {
        const signature = paintSignature(node, property);
        if (!signature) continue;
        // A layer in an instance that hasn't been overridden changes with its main component's layer.
        if (
          pass === 'instances' &&
          dryRun &&
          plannedInMain.get(`${mainLayerId(node)}|${property}`) === signature
        ) {
          continue;
        }
        const changed = await rebindProperty(node, layer, property);
        if (changed && pass === 'main')
          plannedInMain.set(`${node.id}|${property}`, signature);
      }
      if (pass === 'main' && rules.clearMode) {
        await clearModes(node, layer);
      }
    }

    if ('children' in node) {
      for (const child of node.children) {
        await visitLayer(
          child,
          { ...layer, path: `${layer.path}/${child.name}` },
          inInstance || node.type === 'INSTANCE',
          pass,
        );
      }
    }
    await pause();
  };

  // Rebinds a layer's fills (text colors for text) or strokes. Returns whether anything changed.
  const rebindProperty = async (
    node: SceneNode,
    layer: LayerContext,
    property: 'fill' | 'stroke',
  ): Promise<boolean> => {
    if (property === 'stroke') {
      if (!('strokes' in node)) return false;
      const strokes = await rebindPaints(node.strokes, layer, 'stroke');
      if (!strokes) return false;
      if (!dryRun) node.strokes = strokes;
      return true;
    }
    if (!('fills' in node)) return false;
    if (node.type !== 'TEXT') {
      if (node.fills === figma.mixed) return false;
      const fills = await rebindPaints(node.fills, layer, 'fill');
      if (!fills) return false;
      if (!dryRun) node.fills = fills;
      return true;
    }
    // Text can have different colors in different ranges.
    const segments = node.getStyledTextSegments(['fills']);
    const updates: Array<{ start: number; end: number; fills: Paint[] }> = [];
    for (const segment of segments) {
      const fills = await rebindPaints(segment.fills, layer, 'text');
      if (fills)
        updates.push({ start: segment.start, end: segment.end, fills });
    }
    if (updates.length === 0) return false;
    if (dryRun) return true;
    const missingFont = await fonts.load(node);
    if (missingFont) {
      warn(
        `Skipped text in ${layer.component}, as the font ${missingFont} isn't available.`,
      );
      return false;
    }
    for (const { start, end, fills } of updates) {
      node.setRangeFills(start, end, fills);
    }
    return true;
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
        layer.component,
        'mode',
        `${collection.name} ${mode.name}`,
        'inherited',
      );
      if (!dryRun) node.clearExplicitVariableModeForCollection(collection);
    }
  };

  for (const pass of ['main', 'instances'] as const) {
    for (const { target, node } of roots) {
      const variants = node.type === 'COMPONENT_SET' ? node.children : [node];
      for (const variant of variants) {
        await visitLayer(
          variant,
          {
            component: target.name.trim(),
            variant: node.type === 'COMPONENT_SET' ? variant.name : '',
            path: '',
          },
          false,
          pass,
        );
      }
    }
  }
}

/** Finds the target components in the file. Logs a warning for each one that isn't there. */
export async function findComponents(
  targets: ComponentTarget[],
  log: MigrationLog,
): Promise<Root[]> {
  const warn = createWarn(log);
  const roots: Root[] = [];
  const pageNames = [...new Set(targets.map((target) => target.page))];
  for (const pageName of pageNames) {
    const page = figma.root.children.find(
      (p) => normalizePageName(p.name) === normalizePageName(pageName),
    );
    const onPage = targets.filter((target) => target.page === pageName);
    if (!page) {
      warn(
        `Could not find the page ${pageName}, so its components were left as they are: ${onPage.map((t) => t.name.trim()).join(', ')}.`,
      );
      continue;
    }
    await page.loadAsync();
    const components = page
      .findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
      .filter(
        (node) =>
          node.type === 'COMPONENT_SET' ||
          node.parent?.type !== 'COMPONENT_SET',
      );
    for (const target of onPage) {
      const found = components.filter(
        (node) => node.name.trim() === target.name.trim(),
      );
      if (found.length === 0) {
        warn(
          `Could not find the component ${target.name.trim()} on the page ${pageName}, so it was left as it is.`,
        );
      }
      for (const node of found) roots.push({ target, node });
    }
  }
  return roots;
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

/** Counts one more layer with this change. */
function countChange(
  log: MigrationLog,
  component: string,
  property: PaintProperty | 'mode',
  from: string,
  to: string,
): void {
  const what = WHAT[property];
  const key = [component, what, from, to].join('|');
  const change = log.changes.get(key) ?? {
    component,
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

/**
 * The IDs of the variables a layer's fills or strokes are bound to, or '' if none. Two layers with the same
 * signature use the same variables.
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
  const ids = paints.map((paint) =>
    paint.type === 'SOLID' ? (paint.boundVariables?.color?.id ?? '') : '',
  );
  return ids.some(Boolean) ? ids.join(',') : '';
}

/** A layer in an instance has an ID like `I1:2;3:4`, ending with the ID of the layer in its main component. */
export const mainLayerId = (node: SceneNode): string =>
  node.id.split(';').pop() ?? node.id;

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
