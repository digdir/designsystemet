import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FocusgroupConfig } from '../../src/types.js';
import { resolveDirectionMap } from '../../src/writing-mode.js';

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

// Mock getComputedStyle since jsdom may not fully support writing modes
function mockComputedStyle(writingMode: string, direction: string) {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    writingMode,
    direction,
  } as CSSStyleDeclaration);
}

describe('resolveDirectionMap', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.restoreAllMocks();
  });

  describe('horizontal-tb LTR', () => {
    beforeEach(() => mockComputedStyle('horizontal-tb', 'ltr'));

    it('inline → ArrowRight/ArrowLeft', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'inline' }),
      );
      expect(map.forward).toEqual(['ArrowRight']);
      expect(map.backward).toEqual(['ArrowLeft']);
    });

    it('block → ArrowDown/ArrowUp', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'block' }),
      );
      expect(map.forward).toEqual(['ArrowDown']);
      expect(map.backward).toEqual(['ArrowUp']);
    });

    it('both → both axes', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'both' }),
      );
      expect(map.forward).toEqual(['ArrowRight', 'ArrowDown']);
      expect(map.backward).toEqual(['ArrowLeft', 'ArrowUp']);
    });
  });

  describe('horizontal-tb RTL', () => {
    beforeEach(() => mockComputedStyle('horizontal-tb', 'rtl'));

    it('inline → ArrowLeft forward, ArrowRight backward', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'inline' }),
      );
      expect(map.forward).toEqual(['ArrowLeft']);
      expect(map.backward).toEqual(['ArrowRight']);
    });

    it('block → ArrowDown/ArrowUp (unchanged)', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'block' }),
      );
      expect(map.forward).toEqual(['ArrowDown']);
      expect(map.backward).toEqual(['ArrowUp']);
    });
  });

  describe('vertical-rl', () => {
    beforeEach(() => mockComputedStyle('vertical-rl', 'ltr'));

    it('inline → ArrowDown/ArrowUp', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'inline' }),
      );
      expect(map.forward).toEqual(['ArrowDown']);
      expect(map.backward).toEqual(['ArrowUp']);
    });

    it('block → ArrowLeft forward, ArrowRight backward', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'block' }),
      );
      expect(map.forward).toEqual(['ArrowLeft']);
      expect(map.backward).toEqual(['ArrowRight']);
    });
  });

  describe('vertical-lr', () => {
    beforeEach(() => mockComputedStyle('vertical-lr', 'ltr'));

    it('block → ArrowRight forward, ArrowLeft backward', () => {
      const map = resolveDirectionMap(
        container,
        makeConfig({ direction: 'block' }),
      );
      expect(map.forward).toEqual(['ArrowRight']);
      expect(map.backward).toEqual(['ArrowLeft']);
    });
  });
});
