import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import '@u-elements/u-details';

export type AccordionItemProps = {
  /**
   * Controls open-state.
   *
   * Using this removes automatic control of open-state
   *
   * @default undefined
   */
  open?: boolean;
  /**
   * Defaults the accordion to open if not controlled
   * @default false
   */
  defaultOpen?: boolean;
  /** Content should be one `<Accordion.Header>` and `<Accordion.Content>` */
  children: ReactNode;
} & HTMLAttributes<HTMLDetailsElement>;

/**
 * Accordion item component, contains `Accordion.Header` and `Accordion.Content` components.
 * @example
 * <AccordionItem>
 *  <AccordionHeader>Header</AccordionHeader>
 *  <AccordionContent>Content</AccordionContent>
 * </AccordionItem>
 */
export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, open, defaultOpen = false, ...rest }, ref) => {
    const internalOpen = useRef(open ?? defaultOpen); // Only render open state on server, let <details> handle state in browser
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const mergedRefs = useMergeRefs([detailsRef, ref]);

    // Control state with a useEffect to animate on prop change and prevent native <details> toggle
    useEffect(() => {
      const details = detailsRef.current;
      const summary = details?.querySelector(':scope > u-summary');
      const isControlled = open !== undefined;
      const handleSummaryClick = (event: Event) => {
        event?.preventDefault(); // Prevent native <details> toggle so we can animate
        if (!isControlled && details) animateToggle(details);
      };

      summary?.addEventListener('click', handleSummaryClick);
      if (details && isControlled) animateToggle(details, open);
      return () => summary?.removeEventListener('click', handleSummaryClick);
    }, [open]);

    return (
      <u-details
        class={cl(
          'ds-accordion__item',
          `ds-accordion__item--${open === undefined ? 'uncontrolled' : 'controlled'}`,
          className,
        )}
        open={internalOpen.current || undefined} // Fallback to undefined to prevent rendering open="false"
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
function animateToggle(details: HTMLDetailsElement, open = !details.open) {
  const isAnimateSupported = 'animate' in details;
  const isReducedMotion = window.matchMedia?.(REDUCED_MOTION).matches;

  if (details.open === open) return;
  if (isReducedMotion || !isAnimateSupported) {
    details.open = open;
    return;
  }

  details.open = false;
  const closed = `${details.scrollHeight}px`;
  details.open = true;
  const opened = `${details.scrollHeight}px`;

  details.style.overflow = 'clip'; // Clip content while animating
  details.animate(
    { height: [open ? closed : opened, open ? opened : closed] },
    { duration: 400, easing: 'ease-in-out' },
  ).onfinish = () => {
    details.style.removeProperty('overflow'); // Restore overlow
    details.open = open;
  };
}
