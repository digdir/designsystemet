import assert from 'assert';

import { act, screen, render as renderRtl } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { lastItem } from '../../../utilities/arrayUtils';

import type { LegacyTabItem, LegacyTabsProps } from './Tabs';
import { LegacyTabs } from './Tabs';

const user = userEvent.setup();

// Test data:
const itemInfo = [
  {
    name: 'Item 1',
    textContent: 'Lorem ipsum dolor sit amet.',
    value: 'item1',
  },
  {
    name: 'Item 2',
    textContent: 'Etiam ac magna pretium, laoreet.',
    value: 'item2',
  },
  {
    name: 'Item 3',
    textContent: 'Phasellus convallis porta commodo. Vivamus.',
    value: 'item3',
  },
];
const items: LegacyTabItem[] = itemInfo.map((item) => ({
  name: item.name,
  content: <p>{item.textContent}</p>,
}));
const itemsWithValues: LegacyTabItem[] = itemInfo.map((item) => ({
  name: item.name,
  content: <p>{item.textContent}</p>,
  value: item.value,
}));
const defaultProps: LegacyTabsProps = {
  items,
};

describe('LegacyTabs', () => {
  it('Renders expected elements', () => {
    render();
    expect(getTablist()).toBeInTheDocument();
    expect(getTabs()).toHaveLength(items.length);
    expect(getTabpanel()).toBeInTheDocument();
  });

  it('Selects first tab by default', () => {
    render();
    expectSelected(getTab(0));
    expectNotSelected(getTab(1));
    expectNotSelected(getTab(2));
    expect(getTabpanel()).toHaveTextContent(itemInfo[0].textContent);
  });

  it('Initially selects tab with name given in the activeTab property if values are not set', () => {
    render({ activeTab: items[1].name });
    expectSelected(getTab(1));
    expectNotSelected(getTab(0));
    expectNotSelected(getTab(2));
    expect(getTabpanel()).toHaveTextContent(itemInfo[1].textContent);
  });

  it('Initially selects tab with value given in the activeTab property if values are set', () => {
    render({ items: itemsWithValues, activeTab: itemsWithValues[1].value });
    expectSelected(getTab(1));
    expectNotSelected(getTab(0));
    expectNotSelected(getTab(2));
    expect(getTabpanel()).toHaveTextContent(itemInfo[1].textContent);
  });

  it('Sets given tab id on tab', () => {
    const tabId = 'some-unique-tab-id';
    render({ items: [...items, { tabId, name: 'Item 4', content: <span /> }] });
    expect(getLastTab()).toHaveAttribute('id', tabId);
  });

  it('Sets given panel id on tab panel', () => {
    const panelId = 'some-unique-panel-id';
    const textContent = 'In dignissim risus enim, sed.';
    const content = <p>{textContent}</p>;
    const tabs = [...items, { panelId, name: 'Item 4', content }];
    render({ items: tabs });
    expect(document.getElementById(panelId)).toHaveTextContent(textContent);
  });

  it('Links corresponding tabs and panels to each other with accessibility attributes', () => {
    render();
    items.forEach((_, i) => {
      const panelId = getTab(i).getAttribute('aria-controls');
      const panel = screen.getByLabelText(items[i].name);
      expect(panel).toHaveAttribute('id', panelId);
    });
  });

  it('Selects and focuses on tab when user clicks on it', async () => {
    render();
    for (let i = 0; i < items.length; i++) {
      await act(() => user.click(getTab(i)));
      expectSelectedIndex(i);
      expect(getTab(i)).toHaveFocus();
    }
  });

  it('Does not focus on any tab by default', () => {
    render();
    getTabs().forEach((tab) => expect(tab).not.toHaveFocus());
  });

  it('Focuses on the first tab when user presses the tab key', async () => {
    const { container } = render();
    await act(() => user.click(container));
    await act(() => user.tab());
    expect(getTab(0)).toHaveFocus();
  });

  it('Moves focus out when one tab has focus and user presses the tab key', async () => {
    render();
    await act(() => user.click(getTab(1)));
    expect(getTab(1)).toHaveFocus();
    await act(() => user.tab());
    getTabs().forEach((tab) => expect(tab).not.toHaveFocus());
  });

  it('Moves focus to the right when user presses the right arrow key', async () => {
    render();
    await act(() => user.click(getTab(0)));
    expect(getTab(0)).toHaveFocus();
    await act(() => user.keyboard('{ArrowRight}'));
    expect(getTab(1)).toHaveFocus();
    await act(() => user.keyboard('{ArrowRight}'));
    expect(getTab(2)).toHaveFocus();
  });

  it('Moves focus to the left when user presses the left arrow key', async () => {
    render();
    await act(() => user.click(getTab(2)));
    expect(getTab(2)).toHaveFocus();
    await act(() => user.keyboard('{ArrowLeft}'));
    expect(getTab(1)).toHaveFocus();
    await act(() => user.keyboard('{ArrowLeft}'));
    expect(getTab(0)).toHaveFocus();
  });

  it('Moves focus to the first tab when the last tab is focused and user presses the right arrow key', async () => {
    render();
    await act(() => user.click(getLastTab()));
    expect(getLastTab()).toHaveFocus();
    await act(() => user.keyboard('{ArrowRight}'));
    expect(getTab(0)).toHaveFocus();
  });

  it('Moves focus to the last tab when the first tab is focused and user presses the left arrow key', async () => {
    render();
    await act(() => user.click(getTab(0)));
    expect(getTab(0)).toHaveFocus();
    await act(() => user.keyboard('{ArrowLeft}'));
    expect(getLastTab()).toHaveFocus();
  });

  it('Selects tab when user navigates with arrow keys and presses the enter key', async () => {
    render();
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Enter}'));
    expectSelected(getTab(1));
  });

  it('Selects tab when user navigates with arrow keys and presses the space key', async () => {
    render();
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Space}'));
    expectSelected(getTab(1));
  });

  it('Throws error if item values are not set and names are not unique', () => {
    const renderFn = () => {
      render({ items: [...items, { name: items[0].name, content: <p /> }] });
    };
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Keeps the console output clean
    expect(renderFn).toThrow('Each tab value must be unique.');
  });

  it('Throws error if item values are set, but not unique', () => {
    const renderFn = () => {
      render({
        items: [
          ...itemsWithValues,
          { name: 'Item 4', content: <p />, value: itemsWithValues[0].value },
        ],
      });
    };
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Keeps the console output clean
    expect(renderFn).toThrow('Each tab value must be unique.');
  });

  it('Throws error if the value given in activeTab is not present among the item names and item values are not given', () => {
    const renderFn = () => {
      render({ activeTab: 'Some name that is not in the list' });
    };
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Keeps the console output clean
    const error = 'The given active tab value must exist in the list of items.';
    expect(renderFn).toThrow(error);
  });

  it('Throws error if the value given in activeTab is not present among the item values if they are given', () => {
    const renderFn = () => {
      render({
        items: itemsWithValues,
        activeTab: 'Some value that is not in the list',
      });
    };
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Keeps the console output clean
    const error = 'The given active tab value must exist in the list of items.';
    expect(renderFn).toThrow(error);
  });

  it('Switches selected tab when rerendered with a new name in the activeTab property and values are not set', () => {
    const { rerender } = render();
    rerender(
      <LegacyTabs
        {...defaultProps}
        activeTab={items[1].name}
      />,
    );
    expectSelected(getTab(1));
  });

  it('Switches selected tab when rerendered with a new value in the activeTab property and values are set', () => {
    const { rerender } = render();
    rerender(
      <LegacyTabs
        {...defaultProps}
        items={itemsWithValues}
        activeTab={itemsWithValues[1].value}
      />,
    );
    expectSelected(getTab(1));
  });

  it("Calls the onChange function with the selected tab's name as a parameter when user selects a tab using the mouse and values are not set", async () => {
    const onChange = jest.fn();
    render({ onChange });
    await act(() => user.click(getTab(1)));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(items[1].name);
  });

  it("Calls the onChange function with the selected tab's value as a parameter when user selects a tab using the mouse and values are set", async () => {
    const onChange = jest.fn();
    render({ items: itemsWithValues, onChange });
    await act(() => user.click(getTab(1)));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(itemsWithValues[1].value);
  });

  it("Calls the onChange function with the selected tab's name as a parameter when user selects a tab using the enter key and values are not set", async () => {
    const onChange = jest.fn();
    render({ onChange });
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Enter}'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(items[1].name);
  });

  it("Calls the onChange function with the selected tab's value as a parameter when user selects a tab using the enter key and values are set", async () => {
    const onChange = jest.fn();
    render({ items: itemsWithValues, onChange });
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Enter}'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(itemsWithValues[1].value);
  });

  it("Calls the onChange function with the selected tab's name as a parameter when user selects a tab using the space key and values are not set", async () => {
    const onChange = jest.fn();
    render({ onChange });
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Space}'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(items[1].name);
  });

  it("Calls the onChange function with the selected tab's value as a parameter when user selects a tab using the space key and values are set", async () => {
    const onChange = jest.fn();
    render({ items: itemsWithValues, onChange });
    await act(() => user.click(getTab(0)));
    await act(() => user.keyboard('{ArrowRight}'));
    await act(() => user.keyboard('{Space}'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(itemsWithValues[1].value);
  });
});

const render = (props?: Partial<LegacyTabsProps>) => {
  return renderRtl(
    <LegacyTabs
      {...defaultProps}
      {...props}
    />,
  );
};

const getTablist = () => screen.getByRole('tablist');
const getTabs = () => screen.getAllByRole('tab');
const getTab = (index: number) => getTabs()[index];
const getLastTab = () => {
  const last = lastItem(getTabs());
  assert(last !== undefined);
  return last;
};
const getTabpanel = () => screen.getByRole('tabpanel');

const expectSelected = (tab: HTMLElement) =>
  expect(tab).toHaveAttribute('aria-selected', 'true');
const expectNotSelected = (tab: HTMLElement) =>
  expect(tab).toHaveAttribute('aria-selected', 'false');
const expectSelectedIndex = (index: number) =>
  getTabs().forEach((tab, i) => {
    if (index === i) expectSelected(tab);
    else expectNotSelected(tab);
  });
