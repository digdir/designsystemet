import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGroup, getItems, isConflict, isFocusable } from './focusgroup.js';

const ATTR_GROUP = 'focusgroup';

describe('getItems', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('discovers direct child buttons', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <button>A</button>
        <button>B</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(3);
    expect(items.map((el?: Element) => el?.textContent)).toEqual([
      'A',
      'B',
      'C',
    ]);
  });

  it('discovers nested focusable descendants', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <div>
          <button>A</button>
          <div>
            <button>B</button>
          </div>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(3);
  });

  it('skips non-focusable elements', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <span>Not focusable</span>
        <button>A</button>
        <div>Not focusable</div>
        <button>B</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  it('skips disabled elements', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <button>A</button>
        <button disabled>Disabled</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  it('skips hidden elements', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <button>A</button>
        <button hidden>Hidden</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  it('skips subtrees with focusgroup="none"', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <button>A</button>
        <div ${ATTR_GROUP}="none">
          <button>Excluded</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
    expect(items.map((el?: Element) => el?.textContent)).toEqual(['A', 'C']);
  });

  it('skips nested focusgroup subtrees', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <button>A</button>
        <div ${ATTR_GROUP}="menu">
          <button>Nested</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
    expect(items.map((el?: Element) => el?.textContent)).toEqual(['A', 'C']);
  });

  it('includes elements with tabindex="0"', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar">
        <div tabindex="0">Focusable div</div>
        <button>A</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  it('returns empty array for empty container', () => {
    document.body.innerHTML = `
      <div id="fg" ${ATTR_GROUP}="toolbar"></div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(0);
  });
});

const createGroup = (value: string) => {
  const div = document.createElement('div');
  div.setAttribute('focusgroup', value);
  return div;
};

describe('getGroup', () => {
  it('returns null unknown behavior token', () => {
    expect(getGroup(new Set([createGroup('unknown')]))).toBeNull();
  });

  // Toolbar
  it('parses "toolbar" with defaults (inline, nowrap)', () => {
    const group = getGroup(new Set([createGroup('toolbar')]));
    expect(group?.role).toBe(undefined);
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(false);
  });

  it('parses "toolbar wrap"', () => {
    const group = getGroup(new Set([createGroup('toolbar wrap')]));
    expect(group?.wrap).toBe(true);
  });

  // Tablist
  it('parses "tablist" with defaults (inline, wrap)', () => {
    const group = getGroup(new Set([createGroup('tablist')]));
    expect(group?.role).toBe('tab');
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });

  it('parses "tablist nowrap" overrides default wrap', () => {
    const group = getGroup(new Set([createGroup('tablist nowrap')]));
    expect(group?.wrap).toBe(false);
  });

  it('parses "tablist block" overrides default inline', () => {
    const group = getGroup(new Set([createGroup('tablist block')]));
    expect(group?.block).toBe(true);
  });

  // Radiogroup
  it('parses "radiogroup" with defaults (both, wrap)', () => {
    const group = getGroup(new Set([createGroup('radiogroup')]));
    expect(group?.block).toBe(undefined);
    expect(group?.wrap).toBe(true);
  });

  // Listbox
  it('parses "listbox" with defaults (block, nowrap)', () => {
    const group = getGroup(new Set([createGroup('listbox')]));
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(false);
  });

  // Menu
  it('parses "menu" with defaults (block, wrap)', () => {
    const group = getGroup(new Set([createGroup('menu')]));
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(true);
  });

  // Menubar
  it('parses "menubar" with defaults (inline, wrap)', () => {
    const group = getGroup(new Set([createGroup('menubar')]));
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });

  // Modifier combinations
  it('parses multiple modifiers together', () => {
    const group = getGroup(
      new Set([createGroup('toolbar block wrap nomemory')]),
    );
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(true);
  });

  it('ignores unknown tokens', () => {
    const group = getGroup(new Set([createGroup('toolbar foo bar')]));
    expect(group?.role).toBe(undefined);
    expect(group?.block).toBe(false);
  });

  it('is case-insensitive', () => {
    const group = getGroup(new Set([createGroup('TOOLBAR WRAP')]));
    expect(group?.role).toBe(undefined);
    expect(group?.wrap).toBe(true);
  });

  it('handles extra whitespace', () => {
    const group = getGroup(new Set([createGroup('  toolbar   wrap  ')]));
    expect(group?.role).toBe(undefined);
    expect(group?.wrap).toBe(true);
  });

  it('explicit modifier matches default (redundant but valid)', () => {
    const group = getGroup(new Set([createGroup('tablist inline wrap')]));
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });
});

describe('isConflict', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      writingMode: 'horizontal-tb',
      direction: 'ltr',
      overflowX: 'visible',
      overflowY: 'visible',
    } as CSSStyleDeclaration);
  });

  it('text input is a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'text';
    expect(isConflict(input)).toBe(true);
  });

  it('number input is a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'number';
    expect(isConflict(input)).toBe(true);
  });

  it('button input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'button';
    expect(isConflict(input)).toBe(false);
  });

  it('submit input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'submit';
    expect(isConflict(input)).toBe(false);
  });

  it('checkbox input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    expect(isConflict(input)).toBe(false);
  });

  it('textarea is a conflict element', () => {
    const textarea = document.createElement('textarea');
    expect(isConflict(textarea)).toBe(true);
  });

  it('select is a conflict element', () => {
    const select = document.createElement('select');
    expect(isConflict(select)).toBe(true);
  });

  it('contenteditable is a conflict element', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isConflict(div)).toBe(true);
  });

  it('button is NOT a conflict element', () => {
    const btn = document.createElement('button');
    expect(isConflict(btn)).toBe(false);
  });

  it('anchor is NOT a conflict element', () => {
    const a = document.createElement('a');
    a.href = '#';
    expect(isConflict(a)).toBe(false);
  });

  it('plain div is NOT a conflict element', () => {
    const div = document.createElement('div');
    expect(isConflict(div)).toBe(false);
  });
});

describe('isFocusable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('button is focusable', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    expect(isFocusable(btn)).toBe(true);
  });

  it('div is not focusable', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(false);
  });

  it('div with tabindex="0" is focusable', () => {
    const div = document.createElement('div');
    div.setAttribute('tabindex', '0');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  it('div with tabindex="-1" is focusable (can be programmatically focused)', () => {
    const div = document.createElement('div');
    div.setAttribute('tabindex', '-1');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  it('disabled button is not focusable', () => {
    const btn = document.createElement('button');
    btn.disabled = true;
    document.body.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  it('hidden element is not focusable', () => {
    const btn = document.createElement('button');
    btn.hidden = true;
    document.body.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  it('anchor with href is focusable', () => {
    const a = document.createElement('a');
    a.href = '#';
    document.body.appendChild(a);
    expect(isFocusable(a)).toBe(true);
  });

  it('anchor without href is not focusable', () => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    expect(isFocusable(a)).toBe(false);
  });

  it('input is focusable', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    expect(isFocusable(input)).toBe(true);
  });

  it('disabled input is not focusable', () => {
    const input = document.createElement('input');
    input.disabled = true;
    document.body.appendChild(input);
    expect(isFocusable(input)).toBe(false);
  });

  it('textarea is focusable', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    expect(isFocusable(textarea)).toBe(true);
  });

  it('select is focusable', () => {
    const select = document.createElement('select');
    document.body.appendChild(select);
    expect(isFocusable(select)).toBe(true);
  });

  it('contenteditable element is focusable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  it('inert element is not focusable', () => {
    const div = document.createElement('div');
    div.setAttribute('inert', '');
    const btn = document.createElement('button');
    div.appendChild(btn);
    document.body.appendChild(div);
    expect(isFocusable(btn)).toBe(false);
  });

  it('non-Element returns false', () => {
    const text = document.createTextNode('hello');
    expect(isFocusable(text as unknown as HTMLElement)).toBe(false);
  });
});
