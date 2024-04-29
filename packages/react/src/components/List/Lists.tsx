import type { HTMLAttributes, OlHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import { Paragraph } from '../Typography';

import { ListContext } from './ListRoot';
import classes from './List.module.css';

export type ListUnorderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const Unordered = forwardRef<HTMLUListElement, ListUnorderedProps>(({ asChild, ...rest }, ref) => {
  const { size, headingId } = useContext(ListContext);

  const Component = asChild ? Slot : 'ul';

  return (
    <Paragraph
      size={size}
      asChild
    >
      <Component
        className={cl(classes[size], rest.className)}
        {...(headingId ? { 'aria-labelledby': headingId } : {})}
        ref={ref}
        {...rest}
      />
    </Paragraph>
  );
});

Unordered.displayName = 'ListUnordered';

export type ListOrderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<OlHTMLAttributes<HTMLOListElement>, 'size'>;

export const Ordered = forwardRef<HTMLOListElement, ListOrderedProps>(({ asChild, ...rest }, ref) => {
  const { size, headingId } = useContext(ListContext);

  const Component = asChild ? Slot : 'ol';

  return (
    <Paragraph
      size={size}
      asChild
    >
      <Component
        className={cl(classes[size], rest.className)}
        {...(headingId ? { 'aria-labelledby': headingId } : {})}
        ref={ref}
        {...rest}
      />
    </Paragraph>
  );
});

Ordered.displayName = 'ListOrdered';
