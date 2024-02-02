import type { HTMLAttributes } from 'react';
import React from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import { Paragraph } from '../Typography';

import { ListContext } from './List';
import classes from './List.module.css';

export type UnorderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const Unordered = React.forwardRef<HTMLUListElement, UnorderedProps>(
  ({ asChild, ...rest }, ref) => {
    const { size, headingId } = React.useContext(ListContext);

    const Component = asChild ? Slot : 'ul';

    return (
      <Paragraph
        size={size}
        asChild
      >
        <Component
          className={cl(classes.list, rest.className)}
          {...(headingId ? { 'aria-labelledby': headingId } : {})}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);

export type OrderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLOListElement>, 'size'>;

export const Ordered = React.forwardRef<HTMLOListElement, OrderedProps>(
  ({ asChild, ...rest }, ref) => {
    const { size, headingId } = React.useContext(ListContext);

    const Component = asChild ? Slot : 'ol';

    return (
      <Paragraph
        size={size}
        asChild
      >
        <Component
          className={cl(classes.list, rest.className)}
          {...(headingId ? { 'aria-labelledby': headingId } : {})}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);
