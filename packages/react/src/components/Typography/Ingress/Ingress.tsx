import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

export type IngressProps = {
  /** Changes text sizing
   * @default 'medium'
   */
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  /** Adds margin-bottom */
  spacing?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `Ingress` to display text as ingress. */
export const Ingress = forwardRef<HTMLParagraphElement, IngressProps>(
  ({ className, size = 'medium', spacing, asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(
          `fds-ingress`,
          `fds-ingress--${size}`,
          spacing && 'fds-ingress--spacing',
          className,
        )}
        {...rest}
      />
    );
  },
);

Ingress.displayName = 'Ingress';
