import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
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
  /** Callback function when AccordionItem toggles due to click on summary or find in page-search */
  onToggle?: (event: Event) => void;
  /** Content should be one `<Accordion.Header>` and `<Accordion.Content>` */
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDetailsElement>, 'onToggle'> &
  (
    | { open: boolean; onToggle: (event: Event) => void }
    | { open?: never; onToggle?: (event: Event) => void }
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
    { className, open, defaultOpen = false, onToggle, ...rest },
    ref,
  ) {
    const controlledOpen = useRef(open); // Using ref so we can access it inside useEffect without unbinding/binding event listeners
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const mergedRefs = useMergeRefs([detailsRef, ref]);
    const toggleRef = useRef(onToggle); // Using ref so we can access it inside useEffect without unbinding/binding event listeners
    const uncontrolledOpen = useRef(defaultOpen || undefined); // Enables rendering defaultOpen on server
    controlledOpen.current = open; // Update controlledOpen on prop change
    toggleRef.current = onToggle; // Update controlledOpen on prop change

    // Provide a controlled state and onFound event
    useEffect(() => {
      const details = detailsRef.current;
      const handleToggle = (event: Event) => {
        if (!details || details.open === controlledOpen.current) return;
        toggleRef.current?.(event);
        setTimeout(() => {
          details.open = controlledOpen.current ?? details.open;
        }); // Let onToggle run before correcting state
      };

      details?.addEventListener('toggle', handleToggle, true);
      return () => details?.removeEventListener('toggle', handleToggle, true);
    }, []);

    return (
      <u-details
        class={cl('ds-accordion__item', className)} // Using class since React does not translate className on custom elements
        open={controlledOpen.current || uncontrolledOpen.current}
        ref={mergedRefs}
        {...rest}
      />
    );
  },
);
