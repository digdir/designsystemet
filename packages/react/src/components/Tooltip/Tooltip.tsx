import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import cl from 'clsx/lite';
import type {
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  RefAttributes,
} from 'react';
import { Fragment, cloneElement, forwardRef, useRef, useState } from 'react';

import type { PortalProps } from '../../types/Portal';

const ARROW_HEIGHT = 7;
const ARROW_GAP = 4;

export type TooltipProps = {
  /**
   * The element that triggers the tooltip.
   * @note Needs to be a single ReactElement and not: <Fragment/> | <></>
   */
  children: ReactElement & RefAttributes<HTMLElement>;
  /** Content of the tooltip */
  content: string;
  /**
   * Placement of the tooltip on the trigger.
   * @default 'top'
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Delay in milliseconds before opening.
   * @default 150
   */
  delay?: number;
  /**
   * Whether the tooltip is open or not.
   * This overrides the internal state of the tooltip.
   */
  open?: boolean;
  /**
   * Whether the tooltip is open by default or not.
   * @default false
   */
  defaultOpen?: boolean;
} & HTMLAttributes<HTMLDivElement> &
  PortalProps;

/**
 * Tooltip component that displays a small piece of information when hovering or focusing on an element.
 * @example
 * <Tooltip content='This is a tooltip'>
 *  <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      placement = 'top',
      delay = 150,
      open: userOpen,
      defaultOpen = false,
      portal = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const Container = portal ? FloatingPortal : Fragment;

    const arrowRef = useRef<SVGSVGElement>(null);
    const internalOpen = userOpen ?? isOpen;

    const { refs, floatingStyles, context } = useFloating({
      open: internalOpen,
      onOpenChange: setIsOpen,
      placement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(ARROW_HEIGHT + ARROW_GAP),
        flip({
          fallbackAxisSideDirection: 'start',
        }),
        shift(),
        arrow({
          element: arrowRef,
        }),
      ],
    });

    const { styles: animationStyles } = useTransitionStyles(context, {
      initial: {
        opacity: 0,
      },
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      // Event listeners to change the open state
      useHover(context, { move: false, delay }),
      useFocus(context),
      useDismiss(context),
      useRole(context, { role: 'tooltip' }),
    ]);

    const mergedRef = useMergeRefs([ref, refs.setFloating]);

    const childMergedRef = useMergeRefs([
      (children as ReactElement & RefAttributes<HTMLElement>)
        .ref as MutableRefObject<HTMLElement>,
      refs.setReference,
    ]);

    if (
      !children ||
      children?.type === Fragment ||
      (children as unknown) === Fragment
    ) {
      console.error(
        '<Tooltip> children needs to be a single ReactElement and not: <Fragment/> | <></>',
      );
      return null;
    }

    return (
      <>
        {cloneElement(
          children,
          getReferenceProps({
            ref: childMergedRef,
          }),
        )}
        {internalOpen && (
          <Container>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, ...animationStyles, ...style }}
              role='tooltip'
              {...getFloatingProps({
                className: cl('ds-tooltip', className),
                ref: mergedRef,
                ...rest,
              })}
            >
              {content}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                className='ds-tooltip__arrow'
                height={ARROW_HEIGHT}
              />
            </div>
          </Container>
        )}
      </>
    );
  },
);

Tooltip.displayName = 'Tooltip';
