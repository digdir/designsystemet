// tests for the RovingTabindexRoot component

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RovingTabindexRoot } from './RovingTabindexRoot';
import { RovingTabindexItem } from './RovingTabindexItem';

const user = userEvent.setup();

describe('RovingTabindexRoot', () => {
  test('can navigate with tab and arrow keys', async () => {
    render(
      <RovingTabindexRoot>
        <RovingTabindexItem>test</RovingTabindexItem>
        <RovingTabindexItem>test2</RovingTabindexItem>
        <RovingTabindexItem>test3</RovingTabindexItem>
      </RovingTabindexRoot>,
    );

    const item1 = screen.getByText('test');
    const item2 = screen.getByText('test2');
    const item3 = screen.getByText('test3');
    await user.tab();
    expect(item1).toHaveFocus();
    await user.type(item1, '{arrowright}');
    expect(item2).toHaveFocus();
    await user.type(item2, '{arrowright}');
    expect(item3).toHaveFocus();
    await user.type(item3, '{arrowright}');
    expect(item1).toHaveFocus();
    await user.type(item1, '{arrowleft}');
    expect(item3).toHaveFocus();
    await user.type(item3, '{arrowleft}');
    expect(item2).toHaveFocus();
    await user.type(item2, '{arrowleft}');
    expect(item1).toHaveFocus();
  });

  test('can navigate with tab and arrow keys with custom value', async () => {
    render(
      <RovingTabindexRoot>
        <RovingTabindexItem
          data-testid='id1'
          value='banana'
        >
          test
        </RovingTabindexItem>
        <RovingTabindexItem
          data-testid='id2'
          value='strawberry'
        >
          test
        </RovingTabindexItem>
        <RovingTabindexItem
          data-testid='id3'
          value='chocolate'
        >
          test
        </RovingTabindexItem>
      </RovingTabindexRoot>,
    );

    const item1 = screen.getByTestId('id1');
    const item2 = screen.getByTestId('id2');
    const item3 = screen.getByTestId('id3');
    await user.tab();
    expect(item1).toHaveFocus();
    await user.type(item1, '{arrowright}');
    expect(item2).toHaveFocus();
    await user.type(item2, '{arrowright}');
    expect(item3).toHaveFocus();
    await user.type(item3, '{arrowright}');
    expect(item1).toHaveFocus();
    await user.type(item1, '{arrowleft}');
    expect(item3).toHaveFocus();
    await user.type(item3, '{arrowleft}');
    expect(item2).toHaveFocus();
    await user.type(item2, '{arrowleft}');
    expect(item1).toHaveFocus();
  });
});
