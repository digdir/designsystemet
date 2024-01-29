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
      <Paragraph
        as='ul'
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
