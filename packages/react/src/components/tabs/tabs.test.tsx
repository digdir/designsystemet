import { render, screen } from '@testing-library/react';
import { useState } from 'react';

import { Tabs } from './';

describe('Tabs', () => {
  it('renders content based on value', () => {
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
    expect(screen.queryByText('content 2')).toHaveAttribute('hidden', '');
    screen.getByRole('tab', { name: 'Tab 2' }).click();
    expect(screen.queryByText('content 2')).toBeVisible();
    expect(screen.queryByText('content 1')).toHaveAttribute('hidden', '');
  });

  it('item renders with correct aria attributes', async () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    await vi.waitFor(
      () => expect(tab).toHaveAttribute('aria-selected', 'false'), // Let MutationObserver run first
    );
    tab.click();
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders ReactNodes as children when TabsPanels value is selected', () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.Panel value='value1'>
          <div>content 1</div>
        </Tabs.Panel>
      </Tabs>,
    );

    expect(screen.queryByText('content 1')).toBeInTheDocument();
  });

  it('has tabindex 0 on tabpanel', () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1' data-testid='panel'>
          content 1
        </Tabs.Panel>
      </Tabs>,
    );

    const panel = screen.getByTestId('panel');
    expect(panel).toHaveAttribute('tabindex', '0');
  });

  it('has no tabindex when tabpanel has focusable element', () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.Panel value='value1' data-testid='panel'>
          <input type='text' />
        </Tabs.Panel>
      </Tabs>,
    );

    const panel = screen.getByTestId('panel');
    expect(panel).not.toHaveAttribute('tabindex', '0');
  });

  it('panel is aria-labelledby button', async () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1' id='custom-id'>
            Tab 1
          </Tabs.Tab>
          <Tabs.Tab value='value2' data-testid='button'>
            Tab 2
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1' data-testid='panel-1'>
          content 1
        </Tabs.Panel>
        <Tabs.Panel value='value2' data-testid='panel-2'>
          content 2
        </Tabs.Panel>
      </Tabs>,
    );

    const testButton = screen.getByRole('tab', { name: 'Tab 2' });

    const panelOne = screen.getByTestId('panel-1');
    expect(panelOne).toHaveAttribute('aria-labelledby', 'custom-id');

    testButton.click(); // Activate tab 2 to render its panel

    const panelTwo = screen.getByTestId('panel-2');
    expect(panelTwo).toHaveAttribute('aria-labelledby', testButton.id);
  });

  it('button has aria-controls for panel', () => {
    render(
      <Tabs defaultValue='value1'>
        <Tabs.List>
          <Tabs.Tab value='value1' data-testid='button-1'>
            Tab 1
          </Tabs.Tab>
          <Tabs.Tab value='value2' data-testid='button-2'>
            Tab 2
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1' data-testid='panel-1'>
          content 1
        </Tabs.Panel>
        <Tabs.Panel value='value2' data-testid='panel-2'>
          content 2
        </Tabs.Panel>
      </Tabs>,
    );

    const buttonOne = screen.getByTestId('button-1');
    const buttonTwo = screen.getByTestId('button-2');
    const panelOne = screen.getByTestId('panel-1');
    const panelTwo = screen.getByTestId('panel-2');

    expect(buttonOne).toHaveAttribute('aria-controls', panelOne.id);
    expect(buttonTwo).toHaveAttribute('aria-controls', panelTwo.id);
  });

  it('calls onChange in controlled mode when selecting tab with keyboard', async () => {
    const ControlledTabs = ({
      onChange,
    }: {
      onChange: (value: string) => void;
    }) => {
      const [value, setValue] = useState('value1');

      return (
        <Tabs
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        >
          <Tabs.List>
            <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
            <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='value1'>content 1</Tabs.Panel>
          <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        </Tabs>
      );
    };

    const onChange = vi.fn();

    render(<ControlledTabs onChange={onChange} />);

    const tabOne = screen.getByRole('tab', { name: 'Tab 1' });
    const tabTwo = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tabOne).toHaveAttribute('aria-selected', 'true');

    tabTwo.focus();
    expect(tabTwo).toHaveFocus();
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    tabTwo.dispatchEvent(space); // Activate second tab with keyboard

    vi.waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('value2');
      expect(tabTwo).toHaveAttribute('aria-selected', 'true');
      expect(tabOne).toHaveAttribute('aria-selected', 'false');
    });
  });

  it('does not switch tabs in controlled mode until value prop changes', async () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <Tabs value='value1' onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
      </Tabs>,
    );

    screen.getByRole('tab', { name: 'Tab 2' }).click();

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('value2');

    expect(screen.queryByText('content 1')).toBeVisible();
    expect(screen.queryByText('content 2')).toHaveAttribute('hidden', '');

    rerender(
      <Tabs value='value2' onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
          <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.queryByText('content 2')).toBeVisible();
    expect(screen.queryByText('content 1')).toHaveAttribute('hidden', '');
  });
});
