import cl from 'clsx/lite';
import { forwardRef, useContext } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { Popover } from '../Popover';
import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuContentProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropddownMenuContent({ className, children, ...rest }, ref) {
  const { size, placement, onClose, open } = useContext(DropdownMenuCtx);

  return (
    <Popover
      asChild
      ref={ref}
      placement={placement}
      onClose={onClose}
      open={open}
      {...rest}
    >
      <ul
        role='menu'
        className={cl('ds-dropdownmenu', className)}
        data-size={size}
      >
        {children}
      </ul>
    </Popover>
  );
});
