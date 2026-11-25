import { afterEach, describe, expect, it, vi } from 'vitest';
import { componentName, pageTitle, stampUiKit } from './stamps';

type Fake = {
  name: string;
  type: string;
  parent?: { type: string };
  shared: Record<string, string>;
  getSharedPluginData: (namespace: string, key: string) => string;
  setSharedPluginData: (namespace: string, key: string, value: string) => void;
};

const fake = (name: string, type: string, shared = {}): Fake => ({
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
    const dialog = fake('Dialog', 'COMPONENT_SET', { component: 'Modal' });
    const variant = fake('state=open', 'COMPONENT');
    variant.parent = { type: 'COMPONENT_SET' };
    const dialogPage = page('❖  Dialog', [header, dialog, variant]);
    const notes = page('---', []);
    const card = page('❖  Kort', [fake('Card', 'COMPONENT')], {
      page: 'Card',
    });
    vi.stubGlobal('figma', { root: { children: [dialogPage, notes, card] } });

    expect(await stampUiKit()).toEqual({ pages: 1, components: 2, kept: 2 });
    expect(dialogPage.shared).toEqual({ page: 'Dialog' });
    expect(notes.shared).toEqual({});
    expect(card.shared).toEqual({ page: 'Card' });
    expect(header.shared).toEqual({ component: '_Header' });
    expect(dialog.shared).toEqual({ component: 'Modal' });
    expect(variant.shared).toEqual({});
  });
});

describe('componentName', () => {
  it('uses the stamp, or else the name', () => {
    expect(
      componentName(
        fake('Dialogue', 'COMPONENT', { component: 'Dialog' }) as never,
      ),
    ).toBe('Dialog');
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
