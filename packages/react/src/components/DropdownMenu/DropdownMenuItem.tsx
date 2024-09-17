import { forwardRef, useContext } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

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

  return (
    <li className={className} style={style}>
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
    </li>
  );
});
