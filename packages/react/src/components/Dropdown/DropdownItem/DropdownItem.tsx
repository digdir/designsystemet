import React, { forwardRef } from 'react';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';

export type DropdownItemProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownItem = forwardRef<HTMLDivElement, ButtonProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Button
        {...rest}
        ref={ref}
        variant='tertiary'
        size='small'
      >
        {children}
      </Button>
    );
  },
);

DropdownItem.displayName = 'Dropdown.Item';
