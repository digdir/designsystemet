import { Slot } from '@radix-ui/react-slot';
import '@digdir/designsystemet-web'; // Import _ds-floating functionality
import type {
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';
import { Children, forwardRef } from 'react';
import type { DefaultProps, Placement } from '../../types';
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
    placement?: Placement;
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
    ref,
  ) {
    /* check if children is a string */
    const isString = typeof rest.children === 'string';
    let tooltipAttribute: 'aria-label' | 'aria-description' | undefined;
    const childInfo = hasAccessibleText(rest.children);
    if (childInfo.type === 'text') {
      tooltipAttribute = 'aria-description';
    } else if (childInfo.type === 'visual') {
      tooltipAttribute = 'aria-label';
    }

    return (
      <Slot
        {...(tooltipAttribute && { [tooltipAttribute]: content || undefined })} // designsystemet-web will re-evaulate if this should be an aria-label or aria-description, but kept here for better SSR
        data-tooltip={content}
        data-placement={placement}
        data-autoplacement={autoPlacement}
        suppressHydrationWarning // Since data-tooltip adds aria-label/aria-description
        ref={ref}
        {...rest}
      >
        {isString ? <span tabIndex={0}>{rest.children}</span> : rest.children}
      </Slot>
    );
  },
);

function isIterable(child: ReactNode): child is Iterable<ReactNode> {
  return typeof (child as Iterable<ReactNode>)[Symbol.iterator] === 'function';
}

function hasAccessibleText(children?: ReactNode) {
  // Breadth-first search, with early return if a text child is found
  const haystack: ReactNode[] = Children.toArray(children);
  const promises = [];
  while (haystack.length) {
    const child = haystack.shift();
    if (!child) {
      continue;
    }
    if (typeof child !== 'object') {
      return { type: 'text', value: child } as const;
    }
    if (child instanceof Promise) {
      promises.push(child);
    } else if (isIterable(child)) {
      haystack.push(...child);
    } else {
      const childsChildren = (child.props as PropsWithChildren | undefined)
        ?.children;
      if (childsChildren) {
        haystack.push(Children.toArray(childsChildren));
      }
    }
  }
  if (promises.length) {
    return { type: 'undecided' } as const;
  }
  return { type: 'visual' } as const;
}
