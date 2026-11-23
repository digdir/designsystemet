import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  describeVariable,
  normalizePageName,
  type RebindRules,
  rebindComponents,
} from './rebind';
import type { MigrationLog } from './types';

const noPause = async () => {};

const VARIABLES = [
  {
    id: 'n-border',
    name: 'color/neutral/border-subtle',
    variableCollectionId: 'semantic',
  },
  {
    id: 'n-text',
    name: 'color/neutral/text-default',
    variableCollectionId: 'semantic',
  },
  { id: 'border-muted', name: 'border-muted', variableCollectionId: 'color' },
  { id: 'text-default', name: 'text-default', variableCollectionId: 'color' },
];

const bound = (id: string) => ({
  type: 'SOLID',
  color: { r: 0, g: 0, b: 0 },
  boundVariables: { color: { type: 'VARIABLE_ALIAS', id } },
});

const boundId = (paints: Array<ReturnType<typeof bound>>) =>
  paints.map((paint) => paint.boundVariables.color.id);

type FakeNode = {
  id: string;
  name: string;
  type: string;
  fills?: unknown[];
  strokes?: unknown[];
  children?: FakeNode[];
  parent?: FakeNode | { type: string };
  explicitVariableModes: Record<string, string>;
};

const node = (
  props: Partial<FakeNode> & Pick<FakeNode, 'id' | 'name' | 'type'>,
): FakeNode => ({
  fills: [],
  strokes: [],
  explicitVariableModes: {},
  ...props,
});

/**
 * A Dialog component with a neutral border, and an instance in it. The instance has a layer that follows the
 * border (same variable as the main layer 2:2) and one with an overridden neutral fill.
 */
function setup() {
  const border = node({
    id: '2:2',
    name: 'Border',
    type: 'RECTANGLE',
    strokes: [bound('n-border')],
  });
  const follows = node({
    id: 'I3:3;2:2',
    name: 'Border',
    type: 'RECTANGLE',
    strokes: [bound('n-border')],
  });
  const overridden = node({
    id: 'I3:3;4:4',
    name: 'Icon',
    type: 'VECTOR',
    fills: [bound('n-text')],
  });
  const instance = node({
    id: '3:3',
    name: 'Close',
    type: 'INSTANCE',
    children: [follows, overridden],
  });
  const component = node({
    id: '1:1',
    name: 'Dialog',
    type: 'COMPONENT',
    children: [border, instance],
    parent: { type: 'PAGE' },
  });
  const page = {
    name: '❖  Dialog',
    loadAsync: async () => {},
    findAllWithCriteria: () => [component],
  };
  vi.stubGlobal('figma', {
    mixed: Symbol('mixed'),
    root: { children: [page] },
    variables: {
      getLocalVariableCollectionsAsync: async () => [
        { id: 'semantic', name: 'Semantic', modes: [] },
        { id: 'color', name: 'Color', modes: [] },
      ],
      getLocalVariablesAsync: async () => VARIABLES,
      getVariableByIdAsync: async (id: string) =>
        VARIABLES.find((v) => v.id === id) ?? null,
      getVariableCollectionByIdAsync: async () => null,
      setBoundVariableForPaint: (
        paint: object,
        _field: string,
        variable: { id: string },
      ) => ({
        ...paint,
        boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } },
      }),
    },
  });
  return { border, follows, overridden };
}

// Neutral to the same step in Color, except border-subtle, which becomes border-muted.
const rules: RebindRules = {
  paint: ({ variable }) => {
    const step = variable.name.match(/^color\/neutral\/(.+)$/)?.[1];
    if (!step) return null;
    return {
      collection: 'Color',
      name: step === 'border-subtle' ? 'border-muted' : step,
    };
  },
};

const newLog = (): MigrationLog => ({ changes: new Map(), warnings: [] });

describe('rebindComponents', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('changes nothing in a dry run, and doesn’t count layers that follow their main component', async () => {
    const { border, follows, overridden } = setup();
    const log = newLog();

    await rebindComponents([{ page: 'Dialog', name: 'Dialog' }], rules, {
      dryRun: true,
      log,
      pause: noPause,
    });

    expect([...log.changes.values()]).toEqual([
      {
        component: 'Dialog',
        what: 'Border',
        from: 'neutral border-subtle',
        to: 'border-muted',
        count: 1,
      },
      {
        component: 'Dialog',
        what: 'Fill',
        from: 'neutral text-default',
        to: 'text-default',
        count: 1,
      },
    ]);
    expect(boundId(border.strokes as never)).toEqual(['n-border']);
    expect(boundId(follows.strokes as never)).toEqual(['n-border']);
    expect(boundId(overridden.fills as never)).toEqual(['n-text']);
    expect(log.warnings).toEqual([]);
  });

  it('rebinds the main component’s layers and the overrides in instances', async () => {
    const { border, overridden } = setup();
    const log = newLog();

    await rebindComponents([{ page: 'Dialog', name: 'Dialog' }], rules, {
      dryRun: false,
      log,
      pause: noPause,
    });

    expect(boundId(border.strokes as never)).toEqual(['border-muted']);
    expect(boundId(overridden.fills as never)).toEqual(['text-default']);
  });

  it('removes paints when the rules say so', async () => {
    const { border } = setup();

    await rebindComponents(
      [{ page: 'Dialog', name: 'Dialog' }],
      { paint: ({ property }) => (property === 'stroke' ? 'remove' : null) },
      { dryRun: false, log: newLog(), pause: noPause },
    );

    expect(border.strokes).toEqual([]);
  });

  it('leaves layers alone when the variable to use is missing', async () => {
    const { border } = setup();
    const log = newLog();

    await rebindComponents(
      [{ page: 'Dialog', name: 'Dialog' }],
      { paint: () => ({ collection: 'Color', name: 'surface-muted' }) },
      { dryRun: false, log, pause: noPause },
    );

    expect(boundId(border.strokes as never)).toEqual(['n-border']);
    expect(log.changes.size).toBe(0);
    expect(log.warnings).toHaveLength(2);
    expect(log.warnings[0]).toMatch(/^Color\/surface-muted is missing/);
  });

  it('warns about components and pages that aren’t in the file', async () => {
    setup();
    const log = newLog();

    await rebindComponents(
      [
        { page: 'Dialog', name: 'Modal' },
        { page: 'Tooltip', name: 'Tooltip' },
      ],
      rules,
      { dryRun: true, log, pause: noPause },
    );

    expect(log.warnings).toEqual([
      'Could not find the component Modal on the page Dialog, so it was left as it is.',
      'Could not find the page Tooltip, so its components were left as they are: Tooltip.',
    ]);
  });
});

describe('normalizePageName', () => {
  it('ignores the symbols and spacing in UI kit page names', () => {
    expect(normalizePageName('❖  Error summary')).toBe('error summary');
    expect(normalizePageName('❖  Textarea  ')).toBe('textarea');
  });
});

describe('describeVariable', () => {
  it('names semantic colors by color and step, and Color variables by step', () => {
    expect(
      describeVariable({
        collection: 'Semantic',
        name: 'color/neutral/border-subtle',
      }),
    ).toBe('neutral border-subtle');
    expect(
      describeVariable({ collection: 'Color', name: 'border-muted' }),
    ).toBe('border-muted');
    expect(describeVariable({ collection: 'Size', name: 'size/1' })).toBe(
      'Size/size/1',
    );
  });
});
