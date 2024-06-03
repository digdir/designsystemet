import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type IngressProps = {
  /** Changes text sizing
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
  ({ size = 'md', className, spacing, asChild, ...rest }, ref) => {
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
