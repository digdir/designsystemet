import React, { useContext, useId } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import { DropdownContext } from '../DropdownContext';

import classes from './DropdownGroup.module.css';

export type DropdownGroupProps = {
  /**
   * Heading of the group
   */
  heading?: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>;

export const DropdownGroup = ({
  children,
  heading,
  ...rest
}: DropdownGroupProps) => {
  const { size } = useContext(DropdownContext);
  const headingId = useId();

  return (
    <>
      <ul
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        {...rest}
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
};

DropdownGroup.displayName = 'Dropdown.Group';
