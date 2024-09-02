import type { AccordionRootProps } from './Accordion';
import { Accordion as AccordionParent } from './Accordion';
import type { AccordionContentProps } from './AccordionContent';
import { AccordionContent } from './AccordionContent';
import type { AccordionHeadingProps } from './AccordionHeading';
import { AccordionHeading } from './AccordionHeading';
import type { AccordionItemProps } from './AccordionItem';
import { AccordionItem } from './AccordionItem';

type AccordionComponent = typeof AccordionParent & {
  Item: typeof AccordionItem;
  Heading: typeof AccordionHeading;
  Content: typeof AccordionContent;
};

/**
 * Accordions are used to toggle the visibility of content.
 * @example
 * <Accordion>
 *  <Accordion.Item>
 *   <Accordion.Heading>Heading 1</Accordion.Heading>
 *   <Accordion.Content>Content 1</Accordion.Content>
 *  </Accordion.Item>
 * <Accordion>
 */
const Accordion = AccordionParent as AccordionComponent;

Accordion.Heading = AccordionHeading;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

Accordion.Heading.displayName = 'Accordion.Heading';
Accordion.Content.displayName = 'Accordion.Content';
Accordion.Item.displayName = 'Accordion.Item';

export type {
  AccordionRootProps,
  AccordionContentProps,
  AccordionHeadingProps,
  AccordionItemProps,
};
export {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeading,
};
