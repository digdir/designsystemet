import {
  autoUpdate,
  computePosition,
  flip,
  type MiddlewareState,
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
  version,
} from 'react';

import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';

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
    {
      id,
      children,
      content,
      placement = 'top',
      autoPlacement = true,
      open,
      className,
      type,
      ...rest
    },
    ref,
  ) {
    const randomTooltipId = useId();

    const [internalOpen, setInternalOpen] = useState(false);

    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const mergedRefs = useMergeRefs([tooltipRef, ref]);

    const controlledOpen = open ?? internalOpen;
    const tooltipId = id ?? randomTooltipId;

    const setOpen = () => {
      setInternalOpen(true);
    };

    const setClose = () => {
      setInternalOpen(false);
    };

    // Position with floating-ui
    useEffect(() => {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;

      tooltip?.togglePopover?.(controlledOpen);
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
              ...(autoPlacement
                ? [flip({ fallbackAxisSideDirection: 'start' }), shift()]
                : []),
              shift(),
              arrowPseudoElement,
              safeAreaElement,
            ],
          }).then(({ x, y }) => {
            tooltip.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
          });
        });
      }
    }, [controlledOpen, placement]);

    /* Add listeners for ESC to dismiss and click outside on mobile */
    useEffect(() => {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setInternalOpen(false);
        }
      };

      const handleClick = (event: MouseEvent) => {
        const el = event.target as Element | null;
        const isTooltip = tooltip?.contains(el as Node);
        const isTrigger = trigger?.contains(el as Node);
        const isOutside = !isTrigger && !isTooltip;

        if (isOutside && controlledOpen) {
          setInternalOpen(false);
        }
      };

      if (controlledOpen) {
        window.addEventListener('keydown', handleKeyDown);
        /* Add click listener to handle mobile tap-to-close */
        document.addEventListener('click', handleClick);
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClick);
      };
    }, [controlledOpen]);

    /* If children is only a string, make a span */
    const ChildContainer = typeof children === 'string' ? 'span' : Slot;

    /* Make sure it is valid */
    if (typeof children !== 'string' && children.type === Fragment) {
      console.error(
        '<Tooltip> children needs to be a single ReactElement that can receive a ref and not: <Fragment/> | <></>',
      );
      return null;
    }

    const popoverProps = {
      [version.startsWith('19') ? 'popoverTarget' : 'popovertarget']: tooltipId,
      [version.startsWith('19')
        ? 'popoverTargetAction'
        : 'popovertargetaction']: 'show',
    };

    const autoType = `aria-${triggerRef.current?.innerText.trim() ? 'describedby' : 'labelledby'}`;

    return (
      <>
        <ChildContainer
          ref={triggerRef}
          {...popoverProps}
          onMouseEnter={setOpen}
          onMouseLeave={setClose}
          onFocus={setOpen}
          onBlur={setClose}
          {...{ [type ? 'aria-' + type : autoType]: tooltipId }}
        >
          {children}
        </ChildContainer>
        <span
          onMouseEnter={setOpen}
          onMouseLeave={setClose}
          ref={mergedRefs}
          role='tooltip'
          className={cl('ds-tooltip', className)}
          id={tooltipId}
          popover='manual'
          {...rest}
        >
          {content}
        </span>
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

const safeAreaElement = {
  name: 'SafeAreaElement',
  fn(data: MiddlewareState) {
    const { elements, placement } = data;

    let width = '100%';
    let height = 'var(--dsc-tooltip-arrow-size)';
    let translate = '0px';

    switch (placement) {
      case 'top':
        translate = `-50% 0%`;
        break;
      case 'right':
        height = '100%';
        width = 'var(--dsc-tooltip-arrow-size)';
        translate = '-100% -50%';
        break;
      case 'bottom':
        translate = '-50% -100%';
        break;
      case 'left':
        height = '100%';
        width = 'var(--dsc-tooltip-arrow-size)';
        translate = '0 -50%';
        break;
    }

    elements.floating.style.setProperty(
      '--_dsc-tooltip-safearea-height',
      height,
    );
    elements.floating.style.setProperty('--_dsc-tooltip-safearea-width', width);
    elements.floating.style.setProperty(
      '--_dsc-tooltip-safearea-translate',
      translate,
    );
    return data;
  },
};
