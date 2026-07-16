import { beforeEach, describe, expect, it } from 'vitest';
import { isFocusable } from '../../src/utils.js';

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
    expect(isFocusable(text as unknown as Element)).toBe(false);
  });
});
