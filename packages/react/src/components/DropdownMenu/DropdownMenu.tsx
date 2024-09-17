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
    { placement = 'bottom-end', size = 'md', className, ...rest },
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
        size={size}
        className={cl('ds-dropdownmenu', className)}
        {...rest}
      />
    );
  },
);
