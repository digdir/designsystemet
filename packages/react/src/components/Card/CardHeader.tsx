import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import classes from './Card.module.css';

export type CardHeaderProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cl(classes.header, className)}
      ref={ref}
      {...rest}
    />
  );
});

CardHeader.displayName = 'CardHeader';
