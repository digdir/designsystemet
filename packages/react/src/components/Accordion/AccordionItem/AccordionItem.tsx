import cl from 'clsx';
import type { ReactNode, HTMLAttributes } from 'react';
import { createContext, forwardRef, useState, useId } from 'react';

export type AccordionItemProps = {
  /**
   * Controls open-state.
   *
   * Using this removes automatic control of open-state
   */
  open?: boolean;
  /**  Defaults the accordion to open if not controlled */
  defaultOpen?: boolean;
  /** Content should be one `<Accordion.Header>` and `<Accordion.Content>` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export type AccordionItemContextProps = {
  open: boolean;
  toggleOpen: () => void;
  contentId: string;
};

export const AccordionItemContext = createContext<AccordionItemContextProps | null>(null);

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, open, defaultOpen = false, ...rest }, ref) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
    const contentId = useId();

    return (
      <div
        className={cl('fds-accordion__item', (open ?? internalOpen) && 'fds-accordion__item--open', className)}
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
