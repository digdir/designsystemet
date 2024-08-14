import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { Paragraph } from '../Typography';

export type CardFooterProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Paragraph size='md' asChild>
        <Component
          className={cl(`ds-card__footer`, className)}
          ref={ref}
          {...rest}
        />
      </Paragraph>
    );
  },
);

CardFooter.displayName = 'CardFooter';
