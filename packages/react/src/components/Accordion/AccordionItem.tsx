import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';

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
} & HTMLAttributes<HTMLDivElement>;

type AccordionItemContextProps = {
  open: boolean;
  toggleOpen: () => void;
  contentId: string;
};

export const AccordionItemContext =
  createContext<AccordionItemContextProps | null>(null);

/**
 * Accordion item component, contains `Accordion.Header` and `Accordion.Content` components.
 * @example
 * <AccordionItem>
 *  <AccordionHeader>Header</AccordionHeader>
 *  <AccordionContent>Content</AccordionContent>
 * </AccordionItem>
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, open, defaultOpen = false, ...rest }, ref) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
    const contentId = useId();

    return (
      <div
        className={cl(
          'ds-accordion__item',
          (open ?? internalOpen) && 'ds-accordion__item--open',
          className,
        )}
        ref={ref}
        {...rest}
      >
        <AccordionItemContext.Provider
          value={{
            open: open ?? internalOpen,
            toggleOpen: () => {
              if (open === undefined) {
                setInternalOpen((iOpen) => !iOpen);
              }
            },
            contentId: contentId,
          }}
        >
          {children}
        </AccordionItemContext.Provider>
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
