import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  componentName,
  countStampedPages,
  pageTitle,
  stampUiKit,
} from './stamps';

type Fake = {
  id: string;
  name: string;
  type: string;
  parent?: { type: string };
  shared: Record<string, string>;
  getSharedPluginData: (namespace: string, key: string) => string;
  setSharedPluginData: (namespace: string, key: string, value: string) => void;
};

let nextId = 0;
const fake = (name: string, type: string, shared = {}): Fake => ({
  id: `${++nextId}:1`,
  name,
  type,
  parent: { type: 'PAGE' },
  shared: { ...shared },
  getSharedPluginData(_namespace, key) {
    return this.shared[key] ?? '';
  },
  setSharedPluginData(_namespace, key, value) {
    this.shared[key] = value;
  },
});

const page = (name: string, components: Fake[], shared = {}) => ({
  ...fake(name, 'PAGE', shared),
  loadAsync: async () => {},
  findAllWithCriteria: () => components,
});

describe('stampUiKit', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stamps pages with components and their components, and keeps existing stamps', async () => {
    const header = fake(' _Header ', 'COMPONENT');
    const dialog = fake('Dialog', 'COMPONENT_SET');
    dialog.shared = { component: 'Modal', id: dialog.id };
    // A copy of a stamped component, with the stamp of the one it was copied from.
    const copy = fake('My dialog', 'COMPONENT', {
      component: 'Dialog',
      id: dialog.id,
    });
    const variant = fake('state=open', 'COMPONENT');
    variant.parent = { type: 'COMPONENT_SET' };
    const dialogPage = page('❖  Dialog', [header, dialog, variant, copy]);
    const notes = page('---', []);
    const card = page('❖  Kort', [fake('Card', 'COMPONENT')]);
    card.shared = { page: 'Card', id: card.id };
    vi.stubGlobal('figma', { root: { children: [dialogPage, notes, card] } });

    expect(await stampUiKit()).toEqual({ pages: 1, components: 3, kept: 2 });
    expect(dialogPage.shared).toEqual({ page: 'Dialog', id: dialogPage.id });
    expect(notes.shared).toEqual({});
    expect(card.shared).toEqual({ page: 'Card', id: card.id });
    expect(header.shared).toEqual({ component: '_Header', id: header.id });
    expect(dialog.shared).toEqual({ component: 'Modal', id: dialog.id });
    expect(copy.shared).toEqual({ component: 'My dialog', id: copy.id });
    expect(variant.shared).toEqual({});
  });
});

describe('countStampedPages', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('counts the stamped pages, not copied stamps', () => {
    const stamped = page('❖  Dialog', []);
    stamped.shared = { page: 'Dialog', id: stamped.id };
    const copied = page('Dialog copy', [], { page: 'Dialog', id: stamped.id });
    vi.stubGlobal('figma', {
      root: { children: [stamped, copied, page('---', [])] },
    });

    expect(countStampedPages()).toBe(1);
  });
});

describe('componentName', () => {
  it('uses the stamp, or else the name', () => {
    const stamped = fake('Dialogue', 'COMPONENT');
    stamped.shared = { component: 'Dialog', id: stamped.id };
    expect(componentName(stamped as never)).toBe('Dialog');
    // A stamp copied from another component doesn't count.
    expect(
      componentName(
        fake('My dialog', 'COMPONENT', {
          component: 'Dialog',
          id: '0:0',
        }) as never,
      ),
    ).toBe('My dialog');
    expect(componentName(fake(' Dialog ', 'COMPONENT') as never)).toBe(
      'Dialog',
    );
  });
});

describe('pageTitle', () => {
  it('leaves out the symbols in front of the name', () => {
    expect(pageTitle('❖  Dialog')).toBe('Dialog');
    expect(pageTitle(' $  Icons')).toBe('Icons');
    expect(pageTitle('⚙️   Base components')).toBe('Base components');
    expect(pageTitle('---')).toBe('---');
  });
});
