import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { Heading } from '../Typography';

export type CardHeaderProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Heading size='md' asChild>
        <Component
          className={cl(`ds-card__header`, className)}
          ref={ref}
          {...rest}
        />
      </Heading>
    );
  },
);

CardHeader.displayName = 'CardHeader';
