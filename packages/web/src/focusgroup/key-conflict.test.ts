import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isKeyConflictElement } from '../../src/key-conflict.js';
import type { FocusgroupConfig } from '../../src/types.js';

function makeConfig(
  overrides: Partial<FocusgroupConfig> = {},
): FocusgroupConfig {
  return {
    behavior: 'toolbar',
    direction: 'inline',
    wrap: 'nowrap',
    memory: true,
    raw: 'toolbar',
    gridRowWrap: 'none',
    gridColWrap: 'none',
    ...overrides,
  };
}

describe('isKeyConflictElement', () => {
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
    expect(isKeyConflictElement(input, container, makeConfig())).toBe(true);
  });

  it('number input is a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'number';
    expect(isKeyConflictElement(input, container, makeConfig())).toBe(true);
  });

  it('button input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'button';
    expect(isKeyConflictElement(input, container, makeConfig())).toBe(false);
  });

  it('submit input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'submit';
    expect(isKeyConflictElement(input, container, makeConfig())).toBe(false);
  });

  it('checkbox input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    expect(isKeyConflictElement(input, container, makeConfig())).toBe(false);
  });

  it('textarea is a conflict element', () => {
    const textarea = document.createElement('textarea');
    expect(isKeyConflictElement(textarea, container, makeConfig())).toBe(true);
  });

  it('select is a conflict element', () => {
    const select = document.createElement('select');
    expect(isKeyConflictElement(select, container, makeConfig())).toBe(true);
  });

  it('contenteditable is a conflict element', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isKeyConflictElement(div, container, makeConfig())).toBe(true);
  });

  it('button is NOT a conflict element', () => {
    const btn = document.createElement('button');
    expect(isKeyConflictElement(btn, container, makeConfig())).toBe(false);
  });

  it('anchor is NOT a conflict element', () => {
    const a = document.createElement('a');
    a.href = '#';
    expect(isKeyConflictElement(a, container, makeConfig())).toBe(false);
  });

  it('plain div is NOT a conflict element', () => {
    const div = document.createElement('div');
    expect(isKeyConflictElement(div, container, makeConfig())).toBe(false);
  });
});
