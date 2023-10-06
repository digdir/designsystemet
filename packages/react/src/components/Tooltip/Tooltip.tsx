import React, { useState } from 'react';
import type { Placement } from '@floating-ui/react';
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
  FloatingArrow,
  FloatingPortal,
} from '@floating-ui/react';

import styles from './Tooltip.module.css';

const ARROW_HEIGHT = 7;
const GAP = 2;

type TooltipProps = {
  content: string;
  /** Placement of the tooltip on the trigger. Defaults to 'top' */
  placement?: Placement;
  /** Delay in milliseconds before the tooltip appears. Defaults to 0 */
  delay?: number;
  children: React.ReactNode;
};

export const Tooltip = ({
  content,
  placement = 'top',
  delay = 0,
  children,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const arrowRef = React.useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
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

  // Event listeners to change the open state
  const hover = useHover(context, { move: false, delay });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <>
            <div
              className={styles.wrapper}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {content}
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill='#232323'
              />
            </div>
          </>
        )}
      </FloatingPortal>
    </>
  );
};
