import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs } from '.';

const user = userEvent.setup();

describe('Tabs', () => {
  /* TODO: Fix this failing test */
  /* it('can navigate tabs with keyboard', async () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab data-testid='tab1'>Tab 1</Tabs.Tab>
          <Tabs.Tab data-testid='tab2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>content 1</Tabs.Panel>
        <Tabs.Panel>content 2</Tabs.Panel>
      </Tabs>,
    );

    const tab1 = screen.getByTestId('tab1');
    const tab2 = screen.getByTestId('tab2');
    await user.tab();
    expect(tab1).toHaveFocus();
    await act(async () => await user.keyboard('[ArrowRight]'));
    expect(tab2).toHaveFocus();
    await act(async () => await user.keyboard('[ArrowLeft]'));
    expect(tab1).toHaveFocus();
  }); */

  it('renders content based on value', async () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>content 1</Tabs.Panel>
        <Tabs.Panel>content 2</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.queryByText('content 1')).toBeVisible();
    expect(screen.queryByText('content 2')).toHaveAttribute('hidden');
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.queryByText('content 2')).toBeVisible();
    expect(screen.queryByText('content 1')).toHaveAttribute('hidden');
  });

  it('item renders with correct aria attributes', async () => {
    render(
      <Tabs selectedIndex={0}>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders ReactNodes as children when TabsPanels value is selected', () => {
    render(
      <Tabs selectedIndex={0}>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <div>content 1</div>
        </Tabs.Panel>
      </Tabs>,
    );

    const content = screen.queryByText('content 1');
    expect(content).toBeInTheDocument();
  });

  it('calls onChange when tab is clicked', async () => {
    const onChange = vi.fn();
    render(
      <Tabs onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
