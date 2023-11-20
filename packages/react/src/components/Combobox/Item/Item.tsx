import type { HTMLAttributes } from 'react';
import React, { forwardRef, useId } from 'react';

import { Button } from '../../Button';

export type ItemProps = {
  children: React.ReactNode;
  value: string;
  active?: boolean;
} & HTMLAttributes<HTMLElement>;

export const Item = forwardRef<HTMLElement, ItemProps>(
  ({ children, value, active, ...rest }, ref) => {
    const id = useId();

    return (
      <Button
        ref={ref}
        role='option'
        id={id}
        aria-selected={active}
        {...rest}
        color='first'
        variant='tertiary'
        fullWidth
      >
        {children}
      </Button>
    );
  },
);
