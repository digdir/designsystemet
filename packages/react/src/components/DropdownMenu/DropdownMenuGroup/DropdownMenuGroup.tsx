import { forwardRef, useContext, useId } from 'react';
import type * as React from 'react';
import cl from 'clsx';

import { Paragraph } from '../../Typography';
import { DropdownMenuContext } from '../DropdownMenu';

import classes from './DropdownMenuGroup.module.css';

export type DropdownMenuGroupProps = {
  /**
   * Heading of the group
   */
  heading?: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>;

export const DropdownMenuGroup = forwardRef<HTMLUListElement, DropdownMenuGroupProps>(
  ({ children, heading, className, style, ...rest }, ref) => {
    const { size } = useContext(DropdownMenuContext);
    const headingId = useId();

    return (
      <li
        className={className}
        style={style}
      >
        <ul
          {...(heading ? { 'aria-labelledby': headingId } : {})}
          ref={ref}
          role='group'
          className={classes.section}
          {...rest}
        >
          {heading && (
            <Paragraph
              asChild
              size={size}
            >
              <h2
                id={headingId}
                className={cl(classes.heading)}
              >
                {heading}
              </h2>
            </Paragraph>
          )}
          {children}
        </ul>
      </li>
    );
  },
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
