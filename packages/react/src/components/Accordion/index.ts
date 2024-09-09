import { Accordion as AccordionParent } from './Accordion';
import { AccordionContent } from './AccordionContent';
import { AccordionHeading } from './AccordionHeading';
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

export type { AccordionContentProps } from './AccordionContent';
export type { AccordionHeadingProps } from './AccordionHeading';
export type { AccordionItemProps } from './AccordionItem';
export type { AccordionProps } from './Accordion';
export {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeading,
};
