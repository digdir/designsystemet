import {
  type MiddlewareState,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  Fragment,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { useMergeRefs } from '@floating-ui/react';
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
    /** Content of the tooltip */
    content: string;
    /**
     * Placement of the tooltip on the trigger.
     * @default 'top'
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Whether the tooltip is open or not.
     * This overrides the internal state of the tooltip.
     */
    open?: boolean;
  }
>;

/**
 * Tooltip component that displays a small piece of information when hovering or focusing on an element.
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
    { id, children, content, placement = 'top', open, className, ...rest },
    ref,
  ) {
    const randomTooltipId = useId();

    const [internalOpen, setInternalOpen] = useState(false);

    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([tooltipRef, ref]);

    const controlledOpen = open ?? internalOpen;

    // NOTE: This code is purely to add React controlled component ability to Popover API
    useEffect(() => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;

      const setOpen = () => {
        setInternalOpen(true);
      };

      const setClose = () => {
        setInternalOpen(false);
      };

      const handleMouseout = (event: MouseEvent) => {
        /* if we move mouse to tooltip, don't close */
        const el = event.relatedTarget as Element | null;
        if (el === tooltip) return;

        setClose();
      };

      tooltip?.togglePopover?.(controlledOpen);
      trigger.addEventListener('mouseenter', setOpen);
      /* We use document so user can move to tooltip contents */
      document.addEventListener('mouseout', handleMouseout);
      trigger.addEventListener('focusin', setOpen);
      trigger.addEventListener('focusout', setClose);

      return () => {
        trigger.removeEventListener('mouseenter', setOpen);
        document.removeEventListener('mouseout', handleMouseout);
        trigger.removeEventListener('focusin', setOpen);
        trigger.removeEventListener('focusout', setClose);
      };
    }, [controlledOpen]);

    // Position with floating-ui
    useEffect(() => {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      if (tooltip) tooltip.style.opacity = controlledOpen ? '1' : '0';

      if (tooltip && trigger && controlledOpen) {
        return autoUpdate(trigger, tooltip, () => {
          computePosition(trigger, tooltip, {
            placement,
            strategy: 'fixed',
            middleware: [
              offset((data) => {
                // get pseudo element arrow size
                const styles = getComputedStyle(
                  data.elements.floating,
                  '::before',
                );
                return parseFloat(styles.height);
              }),
              flip({
                fallbackAxisSideDirection: 'start',
              }),
              shift(),
              arrowPseudoElement,
            ],
          }).then(({ x, y }) => {
            tooltip.style.translate = `${x}px ${y}px`;
          });
        });
      }
    }, [controlledOpen, placement]);

    /* Add listener for ESC to dismiss */
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setInternalOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    /* If children is only a string, make a span */
    const ChildContainer = typeof children === 'string' ? 'span' : Slot;

    /* Make sure it is valid */
    if (typeof children !== 'string' && children.type === Fragment) {
      console.error(
        '<Tooltip> children needs to be a single ReactElement that can receive a ref and not: <Fragment/> | <></>',
      );
      return null;
    }

    return (
      <>
        <ChildContainer
          ref={triggerRef}
          popovertarget={id ?? randomTooltipId}
          // We set this to not close on click, since it should always show on hover
          // @ts-ignore @types/react-dom does not understand popovertargetaction yet
          popovertargetaction='show'
        >
          {children}
        </ChildContainer>
        <div
          ref={mergedRefs}
          role='tooltip'
          className={cl('ds-tooltip', className)}
          id={id ?? randomTooltipId}
          // @ts-ignore @types/react-dom does not understand popover yet
          popover='manual'
          {...rest}
        >
          {content}
        </div>
      </>
    );
  },
);

const arrowPseudoElement = {
  name: 'ArrowPseudoElement',
  fn(data: MiddlewareState) {
    const { elements, rects, placement } = data;

    let arrowX = `${Math.round(
      rects.reference.width / 2 + rects.reference.x - data.x,
    )}px`;
    let arrowY = `${Math.round(
      rects.reference.height / 2 + rects.reference.y - data.y,
    )}px`;

    switch (placement) {
      case 'top':
        arrowY = '100%';
        break;
      case 'right':
        arrowX = '0';
        break;
      case 'bottom':
        arrowY = '0';
        break;
      case 'left':
        arrowX = '100%';
        break;
    }

    elements.floating.style.setProperty('--dsc-tooltip-arrow-x', arrowX);
    elements.floating.style.setProperty('--dsc-tooltip-arrow-y', arrowY);
    return data;
  },
};
