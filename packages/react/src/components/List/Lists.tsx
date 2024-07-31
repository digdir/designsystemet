import type { HTMLAttributes, OlHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { Paragraph } from '../Typography';

import { ListContext } from './ListRoot';

export type ListUnorderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const Unordered = forwardRef<HTMLUListElement, ListUnorderedProps>(
  ({ asChild, className, ...rest }, ref) => {
    const { size, headingId } = useContext(ListContext);

    const Component = asChild ? Slot : 'ul';

    return (
      <Paragraph size={size} asChild>
        <Component
          className={cl(`ds-list`, `ds-list--${size}`, className)}
          {...(headingId ? { 'aria-labelledby': headingId } : {})}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);

Unordered.displayName = 'ListUnordered';

export type ListOrderedProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<OlHTMLAttributes<HTMLOListElement>, 'size'>;

export const Ordered = forwardRef<HTMLOListElement, ListOrderedProps>(
  ({ asChild, className, ...rest }, ref) => {
    const { size, headingId } = useContext(ListContext);

    const Component = asChild ? Slot : 'ol';

    return (
      <Paragraph size={size} asChild>
        <Component
          className={cl(`ds-list`, `ds-list--${size}`, className)}
          {...(headingId ? { 'aria-labelledby': headingId } : {})}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);

Ordered.displayName = 'ListOrdered';
