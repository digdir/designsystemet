import type { AccordionProps } from './Accordion';
import { Accordion as AccordionParent } from './Accordion';
import AccordionItem from './AccordionItem';
import AccordionContent from './AccordionContent';
import AccordionHeader from './AccordionHeader';

type AccordionComponent = typeof AccordionParent & {
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Content: typeof AccordionContent;
};

const Accordion = AccordionParent as AccordionComponent;

Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

export type { AccordionProps };
export { Accordion };
