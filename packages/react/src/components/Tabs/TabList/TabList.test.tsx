import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tab } from '../Tab';

import { TabList } from '.';

const user = userEvent.setup();

describe('TabItemList', () => {
  test('can navigate tabs with keyboard', async () => {
    render(
      <TabList>
        <Tab value='value1'>Tab 1</Tab>
        <Tab value='value2'>Tab 2</Tab>
      </TabList>,
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
