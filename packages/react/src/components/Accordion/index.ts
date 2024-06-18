import type { AccordionProps } from './Accordion';
import type { AccordionItemProps } from './AccordionItem';
import type { AccordionContentProps } from './AccordionContent';
import type { AccordionHeaderProps } from './AccordionHeading';
import { Accordion as AccordionParent } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionContent } from './AccordionContent';
import { AccordionHeading } from './AccordionHeading';

type AccordionComponent = typeof AccordionParent & {
  Item: typeof AccordionItem;
  Heading: typeof AccordionHeading;
  Content: typeof AccordionContent;
};

const Accordion = AccordionParent as AccordionComponent;

Accordion.Heading = AccordionHeading;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

Accordion.Heading.displayName = 'Accordion.Heading';
Accordion.Content.displayName = 'Accordion.Content';
Accordion.Item.displayName = 'Accordion.Item';

export type {
  AccordionProps,
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
};
export { Accordion, AccordionItem, AccordionContent, AccordionHeading };
