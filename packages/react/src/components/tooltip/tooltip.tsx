import { Slot } from '@radix-ui/react-slot';
import '@digdir/designsystemet-web'; // Import _ds-floating functionality
import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type TooltipProps = MergeRight<
  Omit<DefaultProps, 'data-color'> & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * The element or string that triggers the tooltip.
     *
     * @note If it is a string, it will be wrapped in a span.
     * @note If it is an element, it needs to be able to receive a ref.
     */
    children: (ReactElement & RefAttributes<HTMLElement>) | string;
    /**
     * Content of the tooltip
     **/
    content: string;
    /**
     * Placement of the tooltip on the trigger.
     * @default 'top'
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Whether to enable auto placement.
     * @default true
     */
    autoPlacement?: boolean;
    /**
     * Whether the tooltip is open or not.
     * This overrides the internal state of the tooltip.
     *
     * @deprecated This should not be used on Tooltip. Use a Popover instead
     * @TODO Look at this prop
     */
    open?: boolean;
    /**
     * Override if `aria-describedby` or `aria-labelledby` is used.
     * By default, if the trigger element has no inner text, `aria-labelledby` is used.
     */
    type?: 'describedby' | 'labelledby';
  }
>;

/**
 * Tooltip component that displays a small piece of information when hovering or focusing on an element.
 *
 * @example
 * <Tooltip content='This is a tooltip'>
 *  <button>Hover me</button>
 * </Tooltip>
 *
 * @example
 * <Tooltip content='This is a tooltip'>
 *  Hover me
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { content, placement = 'top', autoPlacement = true, ...rest },
    _ref,
  ) {
    /* check if children is a string */
    const isString = typeof rest.children === 'string';

    return (
      <Slot
        data-tooltip={content}
        data-placement={placement}
        data-autoplacement={autoPlacement}
        suppressHydrationWarning // Since data-tooltip adds aria-label/aria-description
        {...rest}
      >
        {isString ? <span tabIndex={0}>{rest.children}</span> : rest.children}
      </Slot>
    );
  },
);
