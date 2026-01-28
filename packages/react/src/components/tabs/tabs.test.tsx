import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs } from './';

const user = userEvent.setup();

const render = (...args: Parameters<typeof renderRtl>) => {
  vi.useFakeTimers();
  const result = renderRtl(...args);
  vi.runAllTimers(); // Flush any pending timers to setup tags properly
  vi.useRealTimers();
  return result;
};

describe('Tabs', () => {
  it('renders content based on value', async () => {
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
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
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
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
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

    const content = screen.queryByText('content 1');
    expect(content).toBeInTheDocument();
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

    await user.click(testButton); // Activate tab 2 to render its panel

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
});
