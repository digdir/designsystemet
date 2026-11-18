import { describe, expect, it, vi } from 'vitest';
import { suggestion } from './suggestion-helper';

const data = (text: string, value?: string, connected = false) => {
  const el = document.createElement('data');
  el.textContent = text;
  if (value !== undefined) el.setAttribute('value', value);
  if (connected) document.body.append(el);
  return el;
};

const event = (detail?: HTMLDataElement) =>
  ({
    detail,
    preventDefault: vi.fn(),
  }) as unknown as CustomEvent<HTMLDataElement>;

describe('suggestion helper', () => {
  describe('sanitize', () => {
    it('converts non-empty strings to items', () => {
      expect(suggestion('Oslo')).toEqual({ label: 'Oslo', value: 'Oslo' });
      expect(suggestion(['Oslo', 'Bergen'])).toEqual([
        { label: 'Oslo', value: 'Oslo' },
        { label: 'Bergen', value: 'Bergen' },
      ]);
    });

    it('returns null for empty single values', () => {
      expect(suggestion('')).toBeNull();
      expect(suggestion(null)).toBeNull();
      expect(suggestion(undefined)).toBeNull();
    });

    it('filters out empty entries in arrays', () => {
      expect(suggestion([null, '', undefined, 'Oslo'])).toEqual([
        { label: 'Oslo', value: 'Oslo' },
      ]);
    });

    it('keeps items unchanged', () => {
      const item = { label: 'Lars', value: '#004' };
      expect(suggestion(item)).toBe(item);
      expect(suggestion([item])).toEqual([item]);
    });
  });

  describe('render', () => {
    it('maps each item with index', () => {
      const render = vi.fn(({ label }, index) => `${index}:${label}`);
      expect(suggestion(['Oslo', 'Bergen'], render)).toEqual([
        '0:Oslo',
        '1:Bergen',
      ]);
    });

    it('renders a single item, and returns null without calling render when empty', () => {
      const render = vi.fn(({ label }) => label);
      expect(suggestion('Oslo', render)).toBe('Oslo');
      expect(suggestion(null, render)).toBeNull();
      expect(render).toHaveBeenCalledTimes(1);
    });
  });

  describe('comboboxbeforeselect', () => {
    it('prevents the event so the framework can render', () => {
      const e = event(data('Oslo', 'osl'));
      suggestion(null, e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    it('returns items unchanged when the event has no detail', () => {
      expect(suggestion(['Oslo'], event())).toEqual([
        { label: 'Oslo', value: 'Oslo' },
      ]);
      expect(suggestion('Oslo', event())).toEqual({
        label: 'Oslo',
        value: 'Oslo',
      });
    });

    it('selects a new item in single mode, replacing the previous', () => {
      expect(suggestion('Oslo', event(data(' Bergen ', 'brg')))).toEqual({
        label: 'Bergen', // Trimmed
        value: 'brg',
      });
    });

    it('removes the item in single mode when detail is connected', () => {
      expect(suggestion('Oslo', event(data('Oslo', 'Oslo', true)))).toBeNull();
    });

    it('adds a new item in multiple mode', () => {
      expect(suggestion(['Oslo'], event(data('Bergen', 'brg')))).toEqual([
        { label: 'Oslo', value: 'Oslo' },
        { label: 'Bergen', value: 'brg' },
      ]);
    });

    it('removes a connected item in multiple mode', () => {
      const items = [
        { label: 'Oslo', value: 'osl' },
        { label: 'Bergen', value: 'brg' },
      ];
      expect(suggestion(items, event(data('Oslo', 'osl', true)))).toEqual([
        { label: 'Bergen', value: 'brg' },
      ]);
    });

    it('does not duplicate an item that already exists in state', () => {
      expect(suggestion(['Oslo'], event(data('Oslo', 'Oslo')))).toEqual([
        { label: 'Oslo', value: 'Oslo' },
      ]);
    });

    it('uses text as value when <data> has no value attribute', () => {
      expect(suggestion(null, event(data('Oslo')))).toEqual({
        label: 'Oslo',
        value: 'Oslo',
      });
    });

    it('keeps an empty value attribute instead of falling back to text', () => {
      expect(suggestion(null, event(data('xyz', '')))).toEqual({
        label: 'xyz',
        value: '',
      });
    });
  });
});
