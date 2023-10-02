// tests for TabItem
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TabItem } from '.';
import { TabItemList } from '../TabItemList';
import { Tabs } from '..';

const user = userEvent.setup();

describe('TabItem', () => {
  test('item renders with correct aria attributes', async () => {
    render(
      <Tabs defaultValue='value1'>
        <TabItemList>
          <TabItem value='value1'>Tab 1</TabItem>
          <TabItem value='value2'>Tab 2</TabItem>
        </TabItemList>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });
});
