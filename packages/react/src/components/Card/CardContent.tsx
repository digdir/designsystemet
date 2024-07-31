import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { Paragraph } from '../Typography';

export type CardContentProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Paragraph size='md' asChild>
        <Component
          className={cl(`ds-card__content`, className)}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);

CardContent.displayName = 'CardContent';
