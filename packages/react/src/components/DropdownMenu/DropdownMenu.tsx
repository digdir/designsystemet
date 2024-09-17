import cl from 'clsx/lite';
import { forwardRef, useContext, useEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import type { Placement } from '@floating-ui/react';
import { RovingFocusRoot } from '../../utilities';
import { Popover } from '../Popover';
import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuProps = {
  /** Whether the dropdown is open or not.
   * @default undefined
   */
  open?: boolean;
  /** Callback function when dropdown closes */
  onClose?: () => void;
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  /**
   * The size of the dropdown
   * @default md
   **/
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropddownMenuContent(
    {
      open,
      onClose,
      placement = 'bottom-end',
      size = 'md',
      className,
      children,
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
          <RovingFocusRoot orientation='vertical'>{children}</RovingFocusRoot>
        </ul>
      </Popover>
    );
  },
);
