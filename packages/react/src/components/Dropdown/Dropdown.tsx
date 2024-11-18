import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { Placement } from '@floating-ui/react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

export type DropdownProps = MergeRight<
  DefaultProps & Omit<PopoverProps, 'variant'>,
  {
    /** Specify which color palette to use. If left unspecified, the color is inherited from the nearest ancestor with data-color.
     */
    'data-color'?: Color;
    /** The placement of the dropdown
     * @default bottom-end
     */
    placement?: Placement;
  }
>;

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
