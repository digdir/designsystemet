import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
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
  /** Callback function when AccordionItem toggles due to a find in page */
  onFound?: () => void;
  /** Content should be one `<Accordion.Header>` and `<Accordion.Content>` */
  children?: ReactNode;
} & HTMLAttributes<HTMLDetailsElement> &
  (
    | { open: boolean; onFound: () => void }
    | { open?: never; onFound?: () => void }
  );

/**
 * Accordion item component, contains `Accordion.Header` and `Accordion.Content` components.
 * @example
 * <AccordionItem>
 *  <AccordionHeader>Header</AccordionHeader>
 *  <AccordionContent>Content</AccordionContent>
 * </AccordionItem>
 */
export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  function AccordionItem(
    { className, open, defaultOpen = false, onFound, ...rest },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(open ?? defaultOpen);
    const initialOpen = useRef(internalOpen); // Allow rendering initial open state on server, but animate in browser
    const controlledOpen = useRef(internalOpen); // Using ref so we can access it inside useEffect without unbinding/binding event listeners
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const mergedRefs = useMergeRefs([detailsRef, ref]);
    controlledOpen.current = open ?? internalOpen; // Update controlledOpen on prop change

    // Control state with a useEffect to animate on prop change and prevent native <details> toggle
    useEffect(() => {
      const details = detailsRef.current;
      const summary = details?.querySelector(':scope > :is(summary,u-summary)');
      const handleSummaryClick = (event: Event) => {
        event?.preventDefault(); // Prevent native <details> toggle so we can animate
        setInternalOpen((open) => !open);
      };
      const handleToggle = () => {
        if (!details || details.open === controlledOpen.current) return;
        onFound?.();
        setInternalOpen(details?.open || false);
        window.requestAnimationFrame(() => {
          details.open = controlledOpen.current;
        }); // Let onFound run before correcting state
      };

      details?.addEventListener('toggle', handleToggle, true);
      summary?.addEventListener('click', handleSummaryClick);
      return () => {
        details?.removeEventListener('toggle', handleToggle, true);
        summary?.removeEventListener('click', handleSummaryClick);
      };
    }, []);

    useEffect(() => {
      animateHeight(detailsRef.current, controlledOpen.current);
    }, [controlledOpen.current]);

    return (
      <u-details
        class={cl('ds-accordion__item', className)} // Using class since React does not translate className on custom elements
        open={initialOpen.current || undefined} // Fallback to undefined to prevent rendering open="false"
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);

const animateHeight = (details: HTMLDetailsElement | null, open: boolean) => {
  const content = details?.querySelector(':scope > :not(summary, u-summary)');
  const hasContent = content instanceof HTMLElement;
  const hasAnimate = details && 'animate' in details;
  const hasReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (hasReducedMotion || !hasAnimate || !hasContent) {
    if (details) details.open = open;
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
};
