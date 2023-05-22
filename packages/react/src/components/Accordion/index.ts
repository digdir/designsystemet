import type { AccordionProps } from './Accordion';
import type { AccordionItemProps } from './AccordionItem';
import type { AccordionContentProps } from './AccordionContent';
import type { AccordionHeaderProps } from './AccordionHeader';
import { Accordion as AccordionParent } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionContent } from './AccordionContent';
import { AccordionHeader } from './AccordionHeader';

type AccordionComponent = typeof AccordionParent & {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Content: typeof AccordionContent;
};

const Accordion = AccordionParent as AccordionComponent;

Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

export type {
  AccordionProps,
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
};
export { Accordion };
