// tests for the RovingTabindexRoot component

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { RovingTabindexItem } from './RovingTabindexRoot';
import {
  RovingTabindexRoot,
  getNextFocusableValue,
  getPrevFocusableValue,
} from './RovingTabindexRoot';
import { useRovingTabindex } from './useRovingTabindex';

const user = userEvent.setup();

describe('RovingTabindexRoot', () => {
  // implement the RovingTabindexItem component
  const RovingTabindexItem = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { getOrderedItems, getRovingProps } = useRovingTabindex(
      (props.children as string) ?? '',
    );
    const rovingProps = getRovingProps<'div'>({
      onKeyDown: (e) => {
        props?.onKeyDown?.(e);
        const items = getOrderedItems();
        let nextItem: RovingTabindexItem | undefined;
        if (e.key === 'ArrowRight') {
          nextItem = getNextFocusableValue(
            items,
            (props.children as string) ?? '',
          );
        } else if (e.key === 'ArrowLeft') {
          nextItem = getPrevFocusableValue(
            items,
            (props.children as string) ?? '',
          );
        }
        nextItem?.element.focus();
      },
    });
    return <div {...rovingProps}>{props.children}</div>;
  };

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
});
