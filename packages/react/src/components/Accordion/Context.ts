import { createContext, useContext } from 'react';

export enum AccordionIconVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type AccordionClickHandler = () => void;

export const AccordionContext = createContext<
  | {
      open: boolean;
      onClick: AccordionClickHandler;
      headerId: string;
      contentId: string;
      iconVariant: AccordionIconVariant;
    }
  | undefined
>(undefined);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (context === undefined) {
    throw new Error(
      'useAccordionContext must be used within an AccordionContext',
    );
  }
  return context;
};
