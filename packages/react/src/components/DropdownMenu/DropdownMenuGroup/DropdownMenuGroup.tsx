import React, { forwardRef, useContext, useId } from 'react';
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

export const DropdownMenuGroup = forwardRef<
  HTMLUListElement,
  DropdownMenuGroupProps
>(({ children, heading, ...rest }, ref) => {
  const { size } = useContext(DropdownMenuContext);
  const headingId = useId();

  return (
    <li>
      <ul
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        {...rest}
        ref={ref}
        role='group'
        className={cl(classes.section, rest.className)}
      >
        {heading && (
          <Paragraph
            as='h2'
            id={headingId}
            size={size}
            className={cl(classes.heading, rest.className)}
          >
            {heading}
          </Paragraph>
        )}
        {children}
      </ul>
    </li>
  );
});

DropdownMenuGroup.displayName = 'Dropdown.Group';
