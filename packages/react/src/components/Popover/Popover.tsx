import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import type { MiddlewareState, Placement } from '@floating-ui/dom';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef, useContext, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { useEffect } from 'react';
import { Context } from './PopoverContext';

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
  namespace React {
    interface HTMLAttributes<T> {
      popovertarget?: string;
    }
  }
}

export type PopoverProps = {
  /**
   * id to connect the trigger with the popover - required when used without Popover.Context.
   */
  id?: string;
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
  /**
   * Whether to enable auto placement.
   * @default true
   */
  autoPlacement?: boolean;

  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      id,
      className,
      onClose,
      onOpen,
      open,
      placement = 'top',
      size = 'md',
      variant = 'default',
      autoPlacement = true,
      asChild = false,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'div';

    const popoverRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([popoverRef, ref]);
    const { popoverId, setPopoverId } = useContext(Context);
    const [internalOpen, setInternalOpen] = useState(false);
    const controlledOpen = open ?? internalOpen;

    // NOTE: This code is purely to add React controlled component ability to Popover API
    useEffect(() => {
      const popover = popoverRef.current;
      const handleClick = (event: MouseEvent) => {
        const el = event.target as Element | null;
        const isTrigger = el?.closest?.(`[popovertarget="${popover?.id}"]`);
        const isOutside = !isTrigger && !popover?.contains(el);

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

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !controlledOpen) return;
        event.preventDefault(); // Prevent closing fullscreen in Safari
        setInternalOpen(false);
        onClose?.();
      };

      popover?.togglePopover?.(controlledOpen);
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeydown);
      };
    }, [controlledOpen]);

    // Position with floating-ui
    useEffect(() => {
      const popover = popoverRef.current;
      const trigger = document.querySelector(
        `[popovertarget="${popover?.id}"]`,
      );

      if (popover && trigger && controlledOpen)
        return autoUpdate(trigger, popover, () => {
          computePosition(trigger, popover, {
            placement,
            strategy: 'fixed',
            middleware: [
              offset(ARROW_HEIGHT + ARROW_GAP), // TODO: Should this be configurable?
              ...(autoPlacement ? [flip({ fallbackAxisSideDirection: 'start' }), shift()] : []),
              arrowPseudoElement,
            ],
          }).then(({ x, y }) => {
            popover.style.translate = `${x}px ${y}px`;
          });
        });
    }, [controlledOpen, placement, id, autoPlacement]);

    // Update context with id
    useEffect(() => {
      if (id) setPopoverId?.(id);
    }, [id]);

    return (
      <Component
        className={cl('ds-popover', className)}
        data-size={size}
        data-variant={variant}
        id={id || popoverId}
        // @ts-ignore @types/react-dom does not understand popover yet
        popover='manual'
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);

const arrowPseudoElement = {
  name: 'ArrowPseudoElement',
  fn(data: MiddlewareState) {
    const { elements, rects, placement } = data;

    let arrowX = rects.reference.width / 2 + rects.reference.x - data.x;
    let arrowY = rects.reference.height / 2 + rects.reference.y - data.y;

    if (rects.reference.width > rects.floating.width) {
      arrowX = rects.floating.width / 2;
    }

    if (rects.reference.height > rects.floating.height) {
      arrowY = rects.floating.height / 2;
    }

    elements.floating.setAttribute('data-placement', placement.split('-')[0]); // We only need top/left/right/bottom
    elements.floating.style.setProperty(
      '--ds-popover-arrow-x',
      `${Math.round(arrowX)}px`,
    );
    elements.floating.style.setProperty(
      '--ds-popover-arrow-y',
      `${Math.round(arrowY)}px`,
    );
    return data;
  },
};
