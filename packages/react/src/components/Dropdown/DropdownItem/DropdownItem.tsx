import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';
import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import type { OverridableComponent } from '../../../types/OverridableComponent';
import { DropdownContext } from '../DropdownContext';

import classes from './DropdownItem.module.css';

export type DropdownItemProps = React.HTMLAttributes<HTMLLIElement>;

export const DropdownItem: OverridableComponent<
  Omit<ButtonProps, 'variant' | 'size' | 'color' | 'fullWidth'>,
  HTMLButtonElement
> = forwardRef(({ children, ...rest }, ref) => {
  const menu = useContext(DropdownContext);
  const tree = useFloatingTree();
  const item = useListItem();
  const isActive = item.index === menu.activeIndex;

  return (
    <li>
      <Button
        {...rest}
        ref={useMergeRefs([item.ref, ref])}
        variant='tertiary'
        size={menu.size}
        fullWidth
        className={cn(classes.item, rest.className)}
        tabIndex={isActive ? 0 : -1}
        {...(menu.getItemProps
          ? {
              onClick(event: React.MouseEvent<HTMLButtonElement>) {
                rest.onClick?.(event);
                tree?.events.emit('click');
              },
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                rest.onFocus?.(event);
              },
            }
          : {})}
      >
        {children}
      </Button>
    </li>
  );
});

/* DropdownItem.displayName = 'Dropdown.Item'; */
