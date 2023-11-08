import React, { forwardRef } from 'react';

import { Heading } from '../../Typography';

export type DropdownHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownHeader = forwardRef<HTMLDivElement, DropdownHeaderProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Heading
        {...rest}
        ref={ref}
        level={6}
        size='small'
      >
        {children}
      </Heading>
    );
  },
);

DropdownHeader.displayName = 'Dropdown.Header';
