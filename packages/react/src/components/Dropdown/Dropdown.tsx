import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { Placement } from '@floating-ui/react';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

export type DropdownProps = {
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
} & Omit<PopoverProps, 'variant' | 'placement'>;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function DropdownContent(
    { placement = 'bottom-end', className, ...rest },
    ref,
  ) {
    return (
      <Popover
        className={cl('ds-dropdown', className)}
        placement={placement}
        ref={ref}
        {...rest}
      />
    );
  },
);
