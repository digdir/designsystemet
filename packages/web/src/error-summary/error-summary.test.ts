/// <reference types="@testing-library/jest-dom" />
import { describe, expect, it, vi } from 'vitest';

const waitForErrorSummary = async () => {
  vi.runAllTimers();
};

const renderDefault = async () => {
  document.body.innerHTML = `
    <ds-error-summary class="ds-error-summary">
      <h2>There are errors</h2>
      <ul>
        <li><a href="#field">Go to field</a></li>
      </ul>
    </ds-error-summary>`;
  await waitForErrorSummary();
};

describe('Error summary component', () => {
  it('should set aria-labelledby, tabindex, and focus', async () => {
    await renderDefault();

    const errorSummary = document.querySelector('ds-error-summary');
    const heading = document.querySelector('h2');

    expect(errorSummary).toBeInTheDocument();
    expect(heading).toBeInTheDocument();

    expect(heading?.id).not.toBe('');
    expect(errorSummary).toHaveAttribute('aria-labelledby', heading?.id);
    expect(errorSummary).toHaveAttribute('tabindex', '-1');
    expect(errorSummary).toHaveFocus();
  });

  it('should not set aria-labelledby when no heading exists', async () => {
    document.body.innerHTML = `<ds-error-summary class="ds-error-summary">
        <p>Something went wrong</p>
      </ds-error-summary>`;
    await waitForErrorSummary();

    const errorSummary = document.querySelector('ds-error-summary');

    expect(errorSummary).toBeInTheDocument();
    expect(errorSummary).not.toHaveAttribute('aria-labelledby');
    expect(errorSummary).toHaveAttribute('tabindex', '-1');
    expect(errorSummary).toHaveFocus();
  });

  it('should ignore animation events from children', async () => {
    await renderDefault();

    const errorSummary = document.querySelector('ds-error-summary');
    const childLink = document.querySelector('a');

    expect(errorSummary).toBeInTheDocument();
    expect(childLink).toBeInTheDocument();

    errorSummary?.setAttribute('tabindex', '0');
    childLink?.dispatchEvent(new Event('animationend', { bubbles: true }));

    expect(errorSummary).toHaveAttribute('tabindex', '0');
  });
});
