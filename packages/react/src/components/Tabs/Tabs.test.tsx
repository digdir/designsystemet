import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs, type TabsProps } from '.';

const render = async (props: Partial<TabsProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(
      <Tabs {...props}>
        <Tabs.List>
          <Tabs.Tab data-testid='tab1'>Tab 1</Tabs.Tab>
          <Tabs.Tab data-testid='tab2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel data-testid='panel1'>content 1</Tabs.Panel>
        <Tabs.Panel data-testid='panel2'>content 2</Tabs.Panel>
      </Tabs>,
    ),
  };
};

describe('Tabs', () => {
  /* TODO: Fix this failing test */
  /* it('can navigate tabs with keyboard', async () => {
    const { user } = await render();

    const tab1 = screen.getByTestId('tab1');
    const tab2 = screen.getByTestId('tab2');
    await act(async () => await user.tab());
    expect(tab1).toHaveFocus();
    await act(async () => await user.keyboard('[ArrowRight]'));
    expect(tab2).toHaveFocus();
    await act(async () => await user.keyboard('[ArrowLeft]'));
    expect(tab1).toHaveFocus();
  }); */

  it('renders content based on value', async () => {
    const { user } = await render();

    expect(screen.queryByText('content 1')).toBeVisible();
    expect(screen.queryByText('content 2')).toHaveAttribute('hidden');
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.queryByText('content 2')).toBeVisible();
    expect(screen.queryByText('content 1')).toHaveAttribute('hidden');
  });

  it('item renders with correct aria attributes', async () => {
    const { user } = await render();

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when tab is clicked', async () => {
    const onChange = vi.fn();
    const { user } = await render({
      onChange,
    });

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
