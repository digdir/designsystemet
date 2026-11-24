/// <reference types="@testing-library/jest-dom" />
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mimics the parts of error-summary.css that is used to detect visibility
const CSS = `
  @keyframes _is-visible { from { opacity: 0 } }
  .ds-error-summary,
  .other { animation: _is-visible 0ms }
  .ds-error-summary { --_ds-errorsummary: 1 }
`;

const render = (html: string) => {
  document.body.innerHTML = `<style>${CSS}</style>${html}`;
};

const SUMMARY = `
  <fieldset class="ds-error-summary">
    <legend>There are errors</legend>
    <ul>
      <li><a href="#field">Go to field</a></li>
    </ul>
  </fieldset>`;

const tick = async (_?: unknown) =>
  await new Promise((resolve) => setTimeout(resolve, 50)); // Let animationend run

describe('Error summary', () => {
  afterEach(() => {
    window.dsWarnings = undefined;
    vi.restoreAllMocks();
  });

  // Requires native browser CSS animations and registered custom properties
  it('should set tabindex and focus when visible', {
    tags: ['browser'],
  }, async () => {
    render(SUMMARY);
    const errorSummary = document.querySelector('fieldset');

    await expect.poll(() => document.activeElement).toBe(errorSummary);
    expect(errorSummary).toHaveAttribute('tabindex', '-1');
  });

  // Requires native browser CSS animations and registered custom properties
  it('should focus when changing from hidden to visible', {
    tags: ['browser'],
  }, async () => {
    render(SUMMARY.replace('<fieldset', '<fieldset hidden'));
    const errorSummary = document.querySelector('fieldset');

    await tick();
    expect(errorSummary).not.toHaveFocus();
    expect(errorSummary).not.toHaveAttribute('tabindex');

    errorSummary?.removeAttribute('hidden');
    await expect.poll(() => document.activeElement).toBe(errorSummary);
    expect(errorSummary).toHaveAttribute('tabindex', '-1');
  });

  // Requires native browser CSS animations and registered custom properties
  it('should ignore animations on other elements', {
    tags: ['browser'],
  }, async () => {
    render('<fieldset class="other"><legend>Other</legend></fieldset>');
    const fieldset = document.querySelector('fieldset');

    await tick();
    expect(fieldset).not.toHaveFocus();
    expect(fieldset).not.toHaveAttribute('tabindex');
  });

  it('should ignore animation events from children', async () => {
    render(SUMMARY);
    const errorSummary = document.querySelector('fieldset');
    const childLink = document.querySelector('a');

    await tick();
    errorSummary?.setAttribute('tabindex', '0');
    childLink?.focus();
    childLink?.dispatchEvent(new Event('animationend', { bubbles: true }));

    expect(errorSummary).toHaveAttribute('tabindex', '0');
    expect(childLink).toHaveFocus();
  });

  // Requires native browser CSS animations and registered custom properties
  it('should respect tabindex set by consumer', {
    tags: ['browser'],
  }, async () => {
    render(SUMMARY.replace('<fieldset', '<fieldset tabindex="0"'));
    const errorSummary = document.querySelector('fieldset');

    await expect.poll(() => document.activeElement).toBe(errorSummary);
    expect(errorSummary).toHaveAttribute('tabindex', '0');
  });

  // Requires native browser CSS animations and registered custom properties
  it('should focus error summary rendered before script is loaded', {
    tags: ['browser'],
  }, async () => {
    render(SUMMARY);
    const errorSummary = document.querySelector('fieldset');

    await expect.poll(() => document.activeElement).toBe(errorSummary); // Wait for animation to end
    errorSummary?.removeAttribute('tabindex');
    (document.activeElement as HTMLElement)?.blur();
    expect(errorSummary).not.toHaveFocus();

    // Load a fresh instance of the script, to test markup rendered before load
    await import(
      /* @vite-ignore */ `./error-summary.ts?rendered=${Date.now()}`
    );
    expect(errorSummary).toHaveFocus();
    expect(errorSummary).toHaveAttribute('tabindex', '-1');
  });

  // Requires native browser CSS animations and registered custom properties
  it('should warn when missing accessible name', {
    tags: ['browser'],
  }, async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    render(SUMMARY.replace('<legend>There are errors</legend>', ''));
    const errorSummary = document.querySelector('fieldset');

    await expect
      .poll(() => log.mock.calls.flat().join(' '))
      .toContain('Missing accessible name');
    expect(log.mock.calls.flat().join(' ')).toContain('Add a <legend>');
    expect(errorSummary).toHaveFocus();
  });

  // Requires native browser CSS animations and registered custom properties
  it('should not warn when legend, aria-label or aria-labelledby exists', {
    tags: ['browser'],
  }, async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const withoutLegend = SUMMARY.replace(
      '<legend>There are errors</legend>',
      '',
    );

    for (const html of [
      SUMMARY,
      withoutLegend.replace('<fieldset', '<fieldset aria-label="Errors"'),
      withoutLegend.replace(
        '<fieldset',
        '<fieldset aria-labelledby="external-heading"',
      ),
    ]) {
      render(html);
      await expect
        .poll(() => document.activeElement)
        .toBe(
          document.querySelector('fieldset'), // Wait for animation to end
        );
    }

    expect(log.mock.calls.flat().join(' ')).not.toContain(
      'Missing accessible name',
    );
  });

  it('should warn when using deprecated <ds-error-summary>', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    document.body.innerHTML = `
      <ds-error-summary class="ds-error-summary">
        <h2>There are errors</h2>
      </ds-error-summary>`;

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining(
        '<ds-error-summary> is deprecated, please use <fieldset> with <legend> instead',
      ),
    );
  });
});
