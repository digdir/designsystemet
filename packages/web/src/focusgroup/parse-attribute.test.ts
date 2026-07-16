import { describe, expect, it } from 'vitest';
import { parseAttribute } from '../../src/parse-attribute.js';

describe('parseAttribute', () => {
  it('returns null for empty string', () => {
    expect(parseAttribute('')).toBeNull();
  });

  it('returns null for whitespace-only', () => {
    expect(parseAttribute('   ')).toBeNull();
  });

  it('returns null for "none"', () => {
    expect(parseAttribute('none')).toBeNull();
  });

  it('returns null for unknown behavior token', () => {
    expect(parseAttribute('unknown')).toBeNull();
    expect(parseAttribute('foobar')).toBeNull();
  });

  // Toolbar
  it('parses "toolbar" with defaults (inline, nowrap)', () => {
    const config = parseAttribute('toolbar');
    expect(config?.behavior).toBe('toolbar');
    expect(config?.direction).toBe('inline');
    expect(config?.wrap).toBe('nowrap');
    expect(config?.memory).toBe(true);
    expect(config?.gridRowWrap).toBe('none');
    expect(config?.gridColWrap).toBe('none');
  });

  it('parses "toolbar wrap"', () => {
    const config = parseAttribute('toolbar wrap');
    expect(config?.wrap).toBe('wrap');
  });

  // Tablist
  it('parses "tablist" with defaults (inline, wrap)', () => {
    const config = parseAttribute('tablist');
    expect(config?.behavior).toBe('tablist');
    expect(config?.direction).toBe('inline');
    expect(config?.wrap).toBe('wrap');
    expect(config?.memory).toBe(true);
  });

  it('parses "tablist nowrap" overrides default wrap', () => {
    const config = parseAttribute('tablist nowrap');
    expect(config?.wrap).toBe('nowrap');
  });

  it('parses "tablist block" overrides default inline', () => {
    const config = parseAttribute('tablist block');
    expect(config?.direction).toBe('block');
  });

  // Radiogroup
  it('parses "radiogroup" with defaults (both, wrap)', () => {
    const config = parseAttribute('radiogroup');
    expect(config?.direction).toBe('both');
    expect(config?.wrap).toBe('wrap');
  });

  // Listbox
  it('parses "listbox" with defaults (block, nowrap)', () => {
    const config = parseAttribute('listbox');
    expect(config?.direction).toBe('block');
    expect(config?.wrap).toBe('nowrap');
  });

  // Menu
  it('parses "menu" with defaults (block, wrap)', () => {
    const config = parseAttribute('menu');
    expect(config?.direction).toBe('block');
    expect(config?.wrap).toBe('wrap');
  });

  // Menubar
  it('parses "menubar" with defaults (inline, wrap)', () => {
    const config = parseAttribute('menubar');
    expect(config?.direction).toBe('inline');
    expect(config?.wrap).toBe('wrap');
  });

  // Tree
  it('parses "tree" with defaults (block, nowrap)', () => {
    const config = parseAttribute('tree');
    expect(config?.direction).toBe('block');
    expect(config?.wrap).toBe('nowrap');
  });

  // Modifier combinations
  it('parses nomemory modifier', () => {
    const config = parseAttribute('toolbar nomemory');
    expect(config?.memory).toBe(false);
  });

  it('parses multiple modifiers together', () => {
    const config = parseAttribute('toolbar block wrap nomemory');
    expect(config?.direction).toBe('block');
    expect(config?.wrap).toBe('wrap');
    expect(config?.memory).toBe(false);
  });

  it('ignores unknown tokens', () => {
    const config = parseAttribute('toolbar foo bar');
    expect(config?.behavior).toBe('toolbar');
    expect(config?.direction).toBe('inline');
  });

  it('is case-insensitive', () => {
    const config = parseAttribute('TOOLBAR WRAP');
    expect(config?.behavior).toBe('toolbar');
    expect(config?.wrap).toBe('wrap');
  });

  it('handles extra whitespace', () => {
    const config = parseAttribute('  toolbar   wrap  ');
    expect(config?.behavior).toBe('toolbar');
    expect(config?.wrap).toBe('wrap');
  });

  it('explicit modifier matches default (redundant but valid)', () => {
    const config = parseAttribute('tablist inline wrap');
    expect(config?.direction).toBe('inline');
    expect(config?.wrap).toBe('wrap');
  });

  // Grid
  it('parses "grid" with defaults (both, nowrap)', () => {
    const config = parseAttribute('grid');
    expect(config?.behavior).toBe('grid');
    expect(config?.direction).toBe('both');
    expect(config?.wrap).toBe('nowrap');
    expect(config?.gridRowWrap).toBe('none');
    expect(config?.gridColWrap).toBe('none');
  });

  it('parses "grid wrap" sets both axes to wrap', () => {
    const config = parseAttribute('grid wrap');
    expect(config?.gridRowWrap).toBe('wrap');
    expect(config?.gridColWrap).toBe('wrap');
  });

  it('parses "grid flow" sets both axes to flow', () => {
    const config = parseAttribute('grid flow');
    expect(config?.gridRowWrap).toBe('flow');
    expect(config?.gridColWrap).toBe('flow');
  });

  it('parses per-axis grid modifiers', () => {
    const config = parseAttribute('grid row-wrap col-flow');
    expect(config?.gridRowWrap).toBe('wrap');
    expect(config?.gridColWrap).toBe('flow');
  });

  it('per-axis overrides "wrap" for grid', () => {
    const config = parseAttribute('grid wrap col-none');
    expect(config?.gridRowWrap).toBe('wrap');
    expect(config?.gridColWrap).toBe('none');
  });

  it('parses "grid row-flow col-wrap nomemory"', () => {
    const config = parseAttribute('grid row-flow col-wrap nomemory');
    expect(config?.gridRowWrap).toBe('flow');
    expect(config?.gridColWrap).toBe('wrap');
    expect(config?.memory).toBe(false);
  });

  it('grid modifiers are ignored for non-grid behaviors', () => {
    const config = parseAttribute('toolbar row-wrap col-flow');
    expect(config?.gridRowWrap).toBe('none');
    expect(config?.gridColWrap).toBe('none');
  });
});
