import type { HTMLAttributes } from 'react';
import React from 'react';
import cl from 'clsx';

import { Paragraph } from '../Typography';

import { ListContext } from './List';
import classes from './List.module.css';

export type UnorderedProps = Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const Unordered = React.forwardRef<HTMLUListElement, UnorderedProps>(
  ({ children, ...rest }, ref) => {
    const { size, headingId } = React.useContext(ListContext);

    return (
      /* @ts-expect-error #2772 */
      <Paragraph
        as='ul'
        size={size}
        className={cl(classes.list, rest.className)}
        role='list'
        {...(headingId ? { 'aria-labelledby': headingId } : {})}
        ref={ref}
        {...rest}
      >
        {children}
      </Paragraph>
    );
  },
);

export type OrderedProps = Omit<HTMLAttributes<HTMLOListElement>, 'size'>;

export const Ordered = React.forwardRef<HTMLOListElement, OrderedProps>(
  ({ children, ...rest }, ref) => {
    const { size, headingId } = React.useContext(ListContext);

    return (
      /* @ts-expect-error #2772 */
      <Paragraph
        as='ol'
        size={size}
        className={cl(classes.list, rest.className)}
        role='list'
        {...(headingId ? { 'aria-labelledby': headingId } : {})}
        {...rest}
        ref={ref}
      >
        {children}
      </Paragraph>
    );
  },
);
