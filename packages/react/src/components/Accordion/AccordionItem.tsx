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
  /** Callback function when AccordionItem toggles */
  onToggle?: () => void;
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
  ({ className, open, defaultOpen = false, onToggle, ...rest }, ref) => {
    const isControlled = open !== undefined;
    const internalOpen = useRef(open ?? defaultOpen); // Only render open state on server, let <details> handle state in browser
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const mergedRefs = useMergeRefs([detailsRef, ref]);

    // Control state with a useEffect to animate on prop change and prevent native <details> toggle
    useEffect(() => {
      const details = detailsRef.current;
      const summary = details?.querySelector(':scope > u-summary');
      const handleSummaryClick = (event: Event) => {
        event?.preventDefault(); // Prevent native <details> toggle so we can animate
        if (!isControlled && details) animateToggle(details);
      };
      const handleToggle = () => {
        if (isControlled && details && details?.open !== open) {
          setTimeout(() => {
            details.open = open;
            onToggle?.();
          });
        } else onToggle?.();
      };

      details?.addEventListener('toggle', handleToggle, true);
      summary?.addEventListener('click', handleSummaryClick);
      if (details && isControlled) animateToggle(details, open);
      return () => {
        details?.removeEventListener('toggle', handleToggle, true);
        summary?.removeEventListener('click', handleSummaryClick);
      };
    }, [isControlled, open]);

    return (
      <u-details
        class={cl('ds-accordion__item', className)} // Using class since React does not translate className on custom elements
        open={internalOpen.current || undefined} // Fallback to undefined to prevent rendering open="false"
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

function animateToggle(details: HTMLDetailsElement, open = !details.open) {
  const content = details.querySelector<HTMLElement>(
    ':scope > :not(summary, u-summary)',
  );
  const isAnimateSupported = 'animate' in details;
  const isReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (isReducedMotion || !isAnimateSupported || !content) {
    details.open = open;
  } else if (details.open !== open) {
    details.open = true;
    const opened = `${content.scrollHeight}px`;

    content.style.overflow = 'clip'; // Clip content while animating
    content.animate(
      {
        height: [open ? '0px' : opened, open ? opened : '0px'],
        paddingBlock: [open ? '0px' : '', open ? '' : '0px'],
      },
      { duration: 400, easing: 'ease-in-out' },
    ).onfinish = () => {
      content.style.removeProperty('overflow'); // Restore overlow
      details.open = open;
    };
  }
}
