import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { MiddlewareState, Placement } from '@floating-ui/dom';
import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import { forwardRef, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Paragraph } from '../Typography';

const ARROW_HEIGHT = 7;
const ARROW_GAP = 4;

// Make React support popovertarget attribute
// https://github.com/facebook/react/issues/27479
declare global {
  namespace React.JSX {
    interface IntrinsicAttributes {
      popovertarget?: string;
    }
  }
}

export type PopoverProps = {
  /**
   * Required id to connect the trigger with the popover.
   * @required
   */
  id: string;
  /**
   * Placement of the tooltip on the trigger.
   * @default top
   */
  placement?: Placement;
  /**
   * Variant of the popover.
   * @default default
   */
  variant?: 'default' | 'info' | 'warning' | 'danger';
  /**
   * Use this to make the popover controlled.
   * @default undefined
   */
  open?: boolean;
  /**
   * Size of the popover
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Callback when the popover wants to open.
   */
  onOpen?: () => void;
  /**
   * Callback when the popover wants to close.
   */
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      className,
      onClose,
      onOpen,
      open,
      placement = 'top',
      size = 'md',
      style,
      variant = 'default',
      ...rest
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(false);
    const controlledOpen = open ?? internalOpen;
    const popoverRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([popoverRef, ref]);

    // NOTE: This code is not needed if we use the Popover API as inteded,
    // but is purely added to align with React controlled component pattern
    useEffect(() => {
      const popover = popoverRef.current;
      const handleClick = (event: MouseEvent) => {
        const node = event.target as Node;
        const isTrigger = getTrigger(popover?.id)?.contains(node);
        const isOutside = !isTrigger && !popover?.contains(node);

        if (isTrigger) {
          event.preventDefault(); // Prevent native Popover API
          setInternalOpen((open) => !open);
          onOpen?.();
        }
        if (isOutside) {
          setInternalOpen(false);
          onClose?.();
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
      const popover = popoverRef.current;
      const trigger = getTrigger(popover?.id);

      popover?.togglePopover?.(controlledOpen);
      if (popover && trigger && controlledOpen)
        return autoUpdate(trigger, popover, () => {
          computePosition(trigger, popover, {
            placement,
            strategy: 'fixed',
            middleware: [
              offset(ARROW_HEIGHT + ARROW_GAP), // TODO: Should this be configurable?
              flip({ fallbackAxisSideDirection: 'start' }),
              shift(),
              arrowPseudoElement,
            ],
          }).then(({ x, y }) => {
            popover.style.translate = `${x}px ${y}px`;
          });
        });
    }, [controlledOpen, placement, rest.id]);

    return (
      <Paragraph asChild size={size}>
        <div
          className={cl('ds-popover', className)}
          data-ds-size={size}
          data-ds-variant={variant}
          // @ts-ignore @types/react-dom does not understand popover yet
          popover='manual'
          ref={mergedRefs}
          {...rest}
        />
      </Paragraph>
    );
  },
);

const getTrigger = (id?: string) =>
  id ? document.querySelector(`[popovertarget="${id}"]`) : null;

const arrowPseudoElement = {
  name: 'ArrowPseudoElement',
  fn(data: MiddlewareState) {
    const { elements, rects, placement } = data;
    const arrowX = rects.reference.width / 2 + rects.reference.x - data.x;
    const arrowY = rects.reference.height / 2 + rects.reference.y - data.y;

    elements.floating.setAttribute('data-ds-placement', placement);
    elements.floating.style.setProperty('--ds-popover-arrow-x', `${arrowX}px`);
    elements.floating.style.setProperty('--ds-popover-arrow-y', `${arrowY}px`);
    return data;
  },
};
