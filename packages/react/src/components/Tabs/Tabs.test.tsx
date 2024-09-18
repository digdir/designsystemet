import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs } from '.';

const user = userEvent.setup();

describe('Tabs', () => {
  test('can navigate tabs with keyboard', async () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
      </Tabs>,
    );

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await user.tab();
    expect(tab1).toHaveFocus();
    await user.type(tab1, '{arrowright}');
    expect(tab2).toHaveFocus();
    await user.type(tab2, '{arrowleft}');
    expect(tab1).toHaveFocus();
  });

  test('renders content based on value', async () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.queryByText('content 1')).toBeVisible();
    expect(screen.queryByText('content 2')).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.queryByText('content 2')).toBeVisible();
    expect(screen.queryByText('content 1')).not.toBeInTheDocument();
  });

  test('item renders with correct aria attributes', async () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  test('renders ReactNodes as children when TabsPanels value is selected', () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.Panel value='value1'>
          <div>content 1</div>
        </Tabs.Panel>
      </Tabs>,
    );

    const content = screen.queryByText('content 1');
    expect(content).toBeInTheDocument();
  });

  test('can navigate tabs with keyboard', async () => {
    render(
      <Tabs.List>
        <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
        <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      </Tabs.List>,
    );

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await user.tab();
    expect(tab1).toHaveFocus();
    await user.type(tab1, '{arrowright}');
    expect(tab2).toHaveFocus();
    await user.type(tab2, '{arrowleft}');
    expect(tab1).toHaveFocus();
  });
});
