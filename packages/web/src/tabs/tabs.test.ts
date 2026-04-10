/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';

const renderTabs = async () => {
  document.body.innerHTML = `
    <ds-tabs>
      <ds-tablist>
        <ds-tab value="tab-1" id="tab-1">Tab 1</ds-tab>
        <ds-tab value="tab-2">Tab 2</ds-tab>
      </ds-tablist>
      <ds-tabpanel value="tab-1">
      content 1
      </ds-tabpanel>
      <ds-tabpanel value="tab-2">
       content 2
      </ds-tabpanel>
    </ds-tabs>
  `;

  return {
    tablist: document.querySelector('ds-tablist'),
    tabs: document.getElementsByTagName('ds-tab'),
    panels: document.getElementsByTagName('ds-tabpanel'),
  };
};

describe('tabs component', () => {
  it('toggles panels when tabs are activated', async () => {
    const { tabs, panels } = await renderTabs();

    expect(panels[0]).not.toHaveAttribute('hidden');
    expect(panels[1]).toHaveAttribute('hidden');

    tabs[1].click();

    expect(panels[1]).not.toHaveAttribute('hidden');
    expect(panels[0]).toHaveAttribute('hidden');
  });

  it('wires aria-controls and aria-labelledby', async () => {
    const { tabs, panels } = await renderTabs();

    expect(panels[0]).toHaveAttribute('aria-labelledby', tabs[0].id);
    expect(tabs[0]).toHaveAttribute('aria-controls', panels[0].id);
    expect(tabs[1]).toHaveAttribute('aria-controls', panels[1].id);
  });

  it('sets tabindex on panel without focusable content', async () => {
    const { panels } = await renderTabs();
    expect(panels[0]).toHaveAttribute('tabindex', '0');
  });
});
