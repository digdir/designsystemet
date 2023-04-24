import cn from 'classnames';
import React, { forwardRef } from 'react';

import classes from './Accordion.module.css';
import type { AccordionItemType } from './AccordionItem';
import AccordionItem from './AccordionItem';
import type { AccordionContentType } from './AccordionContent';
import AccordionContent from './AccordionContent';
import type { AccordionHeaderType } from './AccordionHeader';
import AccordionHeader from './AccordionHeader';

interface AccordionComponent
  extends React.ForwardRefExoticComponent<
    AccordionProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: AccordionItemType;
  Header: AccordionHeaderType;
  Content: AccordionContentType;
}

export const accordionColor = [
  'neutral',
  'subtle',
  'primary',
  'secondary',
  'tertiary',
] as const;
type AccordionColor = typeof accordionColor[number];

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Accordion color
   * @default neutral
   */
  color?: AccordionColor;
  /**
   * Show border
   * @default false
   */
  border?: boolean;
  /**
   * Instances of Accordion.Item
   */
  children: React.ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ border, color = 'neutral', className, ...rest }, ref) => (
    <div
      {...rest}
      className={cn(
        classes.accordion,
        classes[color],
        {
          [classes.border]: border,
        },
        className,
      )}
      ref={ref}
    />
  ),
) as AccordionComponent;

Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;

export default Accordion;
