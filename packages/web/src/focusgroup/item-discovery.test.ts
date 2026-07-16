import { beforeEach, describe, expect, it } from 'vitest';
import { getItems } from './focusgroup.js';

describe('getItems', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('discovers direct child buttons', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button>B</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(3);
    expect(items.map((el: Element) => el.textContent)).toEqual(['A', 'B', 'C']);
  });

  it('discovers nested focusable descendants', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
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
    const items = getItems(container as Element);
    expect(items).toHaveLength(3);
  });

  it('skips non-focusable elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <span>Not focusable</span>
        <button>A</button>
        <div>Not focusable</div>
        <button>B</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
  });

  it('skips disabled elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button disabled>Disabled</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
  });

  it('skips hidden elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button hidden>Hidden</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
  });

  it('skips subtrees with focusgroup="none"', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <div focusgroup="none">
          <button>Excluded</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
    expect(items.map((el: Element) => el.textContent)).toEqual(['A', 'C']);
  });

  it('skips nested focusgroup subtrees', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <div focusgroup="menu">
          <button>Nested</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
    expect(items.map((el: Element) => el.textContent)).toEqual(['A', 'C']);
  });

  it('includes elements with tabindex="0"', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <div tabindex="0">Focusable div</div>
        <button>A</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(2);
  });

  it('returns empty array for empty container', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar"></div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container as Element);
    expect(items).toHaveLength(0);
  });
});
