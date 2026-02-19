/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

const user = userEvent.setup();

const renderTabs = async (withFocusablePanel = false) => {
  document.body.innerHTML = `
    <ds-tabs>
      <ds-tablist>
        <ds-tab value="tab-1" id="tab-1">Tab 1</ds-tab>
        <ds-tab value="tab-2">Tab 2</ds-tab>
      </ds-tablist>
      <ds-tabpanel value="tab-1" data-testid="panel-1">
        ${withFocusablePanel ? '<input type="text" />' : 'content 1'}
      </ds-tabpanel>
      <ds-tabpanel value="tab-2" data-testid="panel-2">content 2</ds-tabpanel>
    </ds-tabs>
  `;

  vi.runAllTimers();

  const tablist = document.querySelector('ds-tablist');
  const tabs = [...(document.querySelectorAll('ds-tab') || [])];

  await vi.waitUntil(() => tablist?.getAttribute('role') === 'tablist');
  await vi.waitUntil(() => tabs[0]?.getAttribute('role') === 'tab');

  return {
    tablist: tablist as HTMLElement,
    tabOne: tabs[0] as HTMLElement,
    tabTwo: tabs[1] as HTMLElement,
    panelOne: document.querySelector('[data-testid="panel-1"]') as HTMLElement,
    panelTwo: document.querySelector('[data-testid="panel-2"]') as HTMLElement,
  };
};

describe('tabs component', () => {
  it('toggles panels when tabs are activated', async () => {
    const { tabTwo, panelOne, panelTwo } = await renderTabs();

    expect(panelOne).not.toHaveAttribute('hidden');
    expect(panelTwo).toHaveAttribute('hidden');

    await user.click(tabTwo);

    await vi.waitUntil(() => panelTwo.hasAttribute('hidden') === false);

    expect(panelTwo).not.toHaveAttribute('hidden');
    expect(panelOne).toHaveAttribute('hidden');
  });

  it('wires aria-controls and aria-labelledby', async () => {
    const { tabOne, tabTwo, panelOne, panelTwo } = await renderTabs();

    await vi.waitUntil(() => Boolean(tabOne.getAttribute('aria-controls')));

    expect(panelOne).toHaveAttribute('aria-labelledby', tabOne.id);
    expect(tabOne).toHaveAttribute('aria-controls', panelOne.id);
    expect(tabTwo).toHaveAttribute('aria-controls', panelTwo.id);
  });

  it('sets tabindex on panel without focusable content', async () => {
    const { panelOne } = await renderTabs();

    await vi.waitUntil(() => panelOne.hasAttribute('tabindex'));

    expect(panelOne).toHaveAttribute('tabindex', '0');
  });

  it('avoids tabindex when panel has focusable content', async () => {
    const { panelOne } = await renderTabs(true);

    await vi.waitUntil(() => panelOne.hasAttribute('tabindex') === false);

    expect(panelOne).not.toHaveAttribute('tabindex');
  });
});
