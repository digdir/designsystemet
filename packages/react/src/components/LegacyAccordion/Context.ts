import { createContext, useContext } from 'react';

export const accordionIcons = ['primary', 'secondary'] as const;

export type AccordionIcons = typeof accordionIcons[number];

type AccordionContext = {
  open: boolean;
  onClick: AccordionClickHandler;
  headerId: string;
  contentId: string;
  iconVariant: 'primary' | 'secondary';
};

export type AccordionClickHandler = () => void;

export const AccordionContext = createContext<AccordionContext | undefined>(
  undefined,
);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (context === undefined) {
    throw new Error(
      'useAccordionContext must be used within an AccordionContext',
    );
  }
  return context;
};
