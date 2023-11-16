import React, { forwardRef, useContext, useId } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import { DropdownMenuContext } from '../DropdownMenuContext';

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
    <>
      <ul
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        {...rest}
        ref={ref}
        role='group'
        className={cn(classes.section, rest.className)}
      >
        {heading && (
          <Paragraph
            as='h2'
            id={headingId}
            size={size}
            className={cn(classes.heading, rest.className)}
          >
            {heading}
          </Paragraph>
        )}
        {children}
      </ul>
    </>
  );
});

DropdownMenuGroup.displayName = 'Dropdown.Group';
