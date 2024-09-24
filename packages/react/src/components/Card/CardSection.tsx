import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type CardSectionProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardSection({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        className={cl(`ds-card__section`, className)}
        ref={ref}
        {...rest}
      />
    );
  },
);
