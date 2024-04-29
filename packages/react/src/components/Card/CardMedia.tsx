import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import classes from './Card.module.css';

export type CardMediaProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cl(classes.media, className)}
      ref={ref}
      {...rest}
    />
  );
});

CardMedia.displayName = 'CardMedia';
