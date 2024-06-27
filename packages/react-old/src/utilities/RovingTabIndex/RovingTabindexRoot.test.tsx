// tests for the RovingFocusRoot component

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RovingFocusRoot } from './RovingFocusRoot';
import { RovingFocusItem } from './RovingFocusItem';

const user = userEvent.setup();

describe('RovingFocusRoot', () => {
  test('can navigate with tab and arrow keys', async () => {
    render(
      <RovingFocusRoot>
        <RovingFocusItem>test</RovingFocusItem>
        <RovingFocusItem>test2</RovingFocusItem>
        <RovingFocusItem>test3</RovingFocusItem>
      </RovingFocusRoot>,
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
      <RovingFocusRoot>
        <RovingFocusItem
          data-testid='id1'
          value='banana'
        >
          test
        </RovingFocusItem>
        <RovingFocusItem
          data-testid='id2'
          value='strawberry'
        >
          test
        </RovingFocusItem>
        <RovingFocusItem
          data-testid='id3'
          value='chocolate'
        >
          test
        </RovingFocusItem>
      </RovingFocusRoot>,
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
