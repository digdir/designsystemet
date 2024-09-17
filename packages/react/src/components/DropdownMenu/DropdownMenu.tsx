import cl from 'clsx/lite';
import { forwardRef, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

import type { Placement } from '@floating-ui/react';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';
import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuProps = {
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  children: ReactNode;
} & Omit<PopoverProps, 'variant' | 'placement'>;

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropddownMenuContent(
    {
      open,
      onClose,
      placement = 'bottom-end',
      size = 'md',
      className,
      ...rest
    },
    ref,
  ) {
    const { setSize } = useContext(DropdownMenuCtx);

    useEffect(() => {
      if (setSize) {
        setSize(size);
      }
    }, [size, setSize]);

    return (
      <Popover
        ref={ref}
        placement={placement}
        onClose={onClose}
        open={open}
        className={cl('ds-dropdownmenu', className)}
        data-size={size}
        {...rest}
      />
    );
  },
);
