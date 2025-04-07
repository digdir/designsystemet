import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { Placement } from '@floating-ui/dom';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

export type DropdownProps = MergeRight<
  DefaultProps & Omit<PopoverProps, 'variant'>,
  {
    /**
     * The placement of the dropdown
     * @default bottom-end
     */
    placement?: Placement;
  }
>;

/**
 * Dropdown component, used to display a list of options.
 *
 * @example with TriggerContext
 * <Dropdown.TriggerContext>
 *   <Dropdown.Trigger>Dropdown trigger</Dropdown.Trigger>
 *   <Dropdown placement='bottom-end'>
 *     <Dropdown.Heading>Dropdown</Dropdown.Heading>
 *     <Dropdown.List>
 *       <Dropdown.Item>
 *         <Dropdown.Button>Option</Dropdown.Button>
 *       </Dropdown.Item>
 *     </Dropdown.List>
 *   </Dropdown>
 * </Dropdown.TriggerContext>
 *
 * @example without TriggerContext
 * <Button popovertarget="my-dropdown">Trigger</Button>
 * <Dropdown id="my-dropdown">
 *   <Dropdown.Heading>Heading</Dropdown.Heading>
 *   <Dropdown.List>
 *     <Dropdown.Item>
 *       <Dropdown.Button>Item</Dropdown.Button>
 *     </Dropdown.Item>
 *   </Dropdown.List>
 * </Dropdown>
 */
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
