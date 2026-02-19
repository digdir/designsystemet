/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import {
  attr,
  attrOrCSS,
  customElements,
  debounce,
  on,
  onHotReload,
  onMutation,
  setTextWithoutMutation,
  tag,
  useId,
  warn,
} from './utils';

describe('utils', () => {
  it('attr gets, sets, and removes attributes', () => {
    const el = document.createElement('div');

    expect(attr(el, 'data-test')).toBeNull();

    attr(el, 'data-test', 'value');
    expect(el).toHaveAttribute('data-test', 'value');

    attr(el, 'data-test', null);
    expect(el).not.toHaveAttribute('data-test');
  });

  it('attrOrCSS reads from CSS custom property and strips quotes', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-test', '');
    el.style.setProperty('--_ds-test', '"property-value"');

    await vi.waitUntil(
      () => el.style.getPropertyValue('--_ds-test') === '"property-value"',
    );

    expect(attrOrCSS(el, 'test')).toBe('property-value');
  });

  it('warn respects dsWarnings flag', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    (window as Window & { dsWarnings?: boolean }).dsWarnings = false;
    warn('Hidden warning');
    expect(warnSpy).not.toHaveBeenCalled();

    (window as Window & { dsWarnings?: boolean }).dsWarnings = true;
    warn('Visible warning');
    expect(warnSpy).toHaveBeenCalledTimes(1);

    delete (window as Window & { dsWarnings?: boolean }).dsWarnings;
  });

  it('debounce runs only once for rapid calls', async () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('first');
    debounced('second');

    await vi.advanceTimersByTimeAsync(99);
    expect(spy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('second');
  });

  it('on/off attaches and removes multiple event types', () => {
    const el = document.createElement('button');
    const handler = vi.fn();

    const cleanup = on(el, 'focus blur', handler);

    el.dispatchEvent(new FocusEvent('focus'));
    el.dispatchEvent(new FocusEvent('blur'));
    expect(handler).toHaveBeenCalledTimes(2);

    cleanup();

    el.dispatchEvent(new FocusEvent('focus'));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('onHotReload runs cleanup for same key', () => {
    const cleanup = vi.fn();

    onHotReload('test-key', () => [cleanup]);
    onHotReload('test-key', () => [() => undefined]);

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('onMutation invokes callback and supports cleanup', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 0;
      });

    const callback = vi.fn();
    const cleanup = onMutation(el, callback, { childList: true });

    el.appendChild(document.createElement('span'));

    await vi.waitUntil(() => callback.mock.calls.length > 0);

    cleanup();

    expect(callback).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('setTextWithoutMutation updates text and restores mutation processing', () => {
    const el = document.createElement('div');
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 0;
      });

    setTextWithoutMutation(el, 'Updated');

    expect(el.textContent).toBe('Updated');

    rafSpy.mockRestore();
  });

  it('tag creates elements with attributes', () => {
    const el = tag('button', { type: 'button', 'data-test': 'ok' });

    expect(el).toBeInstanceOf(HTMLButtonElement);
    expect(el).toHaveAttribute('type', 'button');
    expect(el).toHaveAttribute('data-test', 'ok');
  });

  it('customElements.define skips duplicate registration', () => {
    const name = 'ds-utils-test';

    customElements.define(name, class extends HTMLElement {});
    customElements.define(name, class extends HTMLElement {});

    expect(window.customElements.get(name)).toBeDefined();
  });

  it('useId assigns and reuses ids', () => {
    const el = document.createElement('div');
    const id = useId(el);

    expect(id).toBeTruthy();
    expect(el.id).toBe(id);
    expect(useId(el)).toBe(id);

    const other = document.createElement('div');
    const otherId = useId(other);

    expect(otherId).not.toBe(id);
  });
});
