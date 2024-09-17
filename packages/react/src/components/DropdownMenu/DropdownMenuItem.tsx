import { forwardRef, useContext, useId } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

import { RovingFocusItem } from '../../utilities';
import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuItemProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'color'
>;

export const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(function DropdownMenuItem({ children, className, style, ...rest }, ref) {
  const { size } = useContext(DropdownMenuCtx);
  const value = useId();

  return (
    <li className={className} style={style}>
      <RovingFocusItem asChild value={value}>
        <Button
          ref={ref}
          variant='tertiary'
          size={size}
          className='ds-dropdownmenu__item'
          role='menuitem'
          {...rest}
        >
          {children}
        </Button>
      </RovingFocusItem>
    </li>
  );
});
