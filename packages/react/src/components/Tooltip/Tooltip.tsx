import type { HTMLAttributes } from 'react';
import React, { cloneElement, forwardRef, useMemo, useState } from 'react';
import cn from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useTransitionStyles,
  FloatingArrow,
  FloatingPortal,
} from '@floating-ui/react';

import styles from './Tooltip.module.css';
import mergeRefs from './utils';

const ARROW_HEIGHT = 7;
const GAP = 4;

export type TooltipProps = {
  /**
   * The element that triggers the tooltip.
   * @note Needs to be a single ReactElement and not: <React.Fragment/> | <></>
   */
  children: React.ReactElement & React.RefAttributes<HTMLElement>;
  content: string;
  /**
   * Placement of the tooltip on the trigger.
   * @default 'top'
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay in milliseconds before opening.
   * @default 150
   */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      placement = 'top',
      delay = 150,
      open: userOpen,
      defaultOpen = false,
      className,
      ...restHTMLProps
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const arrowRef = React.useRef<SVGSVGElement>(null);

    const { refs, floatingStyles, context } = useFloating({
      open: userOpen ?? isOpen,
      onOpenChange: setIsOpen,
      placement,
      // Make sure the tooltip stays on the screen
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(ARROW_HEIGHT + GAP),
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
      // Role props for screen readers
      useRole(context, { role: 'tooltip' }),
    ]);

    const mergedRef = useMemo(
      () => mergeRefs([ref, refs.setFloating]),
      [refs.setFloating, ref],
    );

    const childMergedRef = useMemo(
      () =>
        mergeRefs([
          (children as React.ReactElement & React.RefAttributes<HTMLElement>)
            .ref as React.MutableRefObject<HTMLElement>,
          refs.setReference,
        ]),
      [children, refs.setReference],
    );

    if (
      !children ||
      children?.type === React.Fragment ||
      (children as unknown) === React.Fragment
    ) {
      console.error(
        '<Tooltip> children needs to be a single ReactElement and not: <React.Fragment/> | <></>',
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
        <FloatingPortal>
          {(userOpen ?? isOpen) && (
            <>
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, ...animationStyles }}
                {...getFloatingProps({
                  ...restHTMLProps,
                  className: cn(styles.wrapper, className),
                  ref: mergedRef,
                })}
                role='tooltip'
              >
                {content}
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  fill='var(--fds-semantic-border-neutral-strong)'
                  height={ARROW_HEIGHT}
                />
              </div>
            </>
          )}
        </FloatingPortal>
      </>
    );
  },
);
