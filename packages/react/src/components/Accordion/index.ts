import type { AccordionRootProps } from './AccordionRoot';
import type { AccordionItemProps } from './AccordionItem';
import type { AccordionContentProps } from './AccordionContent';
import type { AccordionHeaderProps } from './AccordionHeading';
import { AccordionRoot } from './AccordionRoot';
import { AccordionItem } from './AccordionItem';
import { AccordionContent } from './AccordionContent';
import { AccordionHeading } from './AccordionHeading';

type AccordionComponent = {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Heading: typeof AccordionHeading;
  Content: typeof AccordionContent;
};

const Accordion = {} as AccordionComponent;

Accordion.Root = AccordionRoot;
Accordion.Heading = AccordionHeading;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

Accordion.Root.displayName = 'Accordion.Root';
Accordion.Heading.displayName = 'Accordion.Heading';
Accordion.Content.displayName = 'Accordion.Content';
Accordion.Item.displayName = 'Accordion.Item';

export type {
  AccordionRootProps,
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
};
export {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionContent,
  AccordionHeading,
};
