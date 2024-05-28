import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TabList } from '../TabList';
import { Tabs } from '..';

import { Tab } from '.';

const user = userEvent.setup();

describe('TabItem', () => {
  test('item renders with correct aria attributes', async () => {
    render(
      <Tabs defaultValue='value1'>
        <TabList>
          <Tab value='value1'>Tab 1</Tab>
          <Tab value='value2'>Tab 2</Tab>
        </TabList>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });
});
