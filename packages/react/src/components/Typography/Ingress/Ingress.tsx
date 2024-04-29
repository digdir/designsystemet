import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import type { OverridableComponent } from '../../../types/OverridableComponent';

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
export const Ingress: OverridableComponent<IngressProps, HTMLParagraphElement> = forwardRef(
  ({ className, size = 'medium', spacing, as = 'p', asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : as;

    return (
      <Component
        ref={ref}
        className={cl(
          `fds-ingress`,
          `fds-ingress--${size}`,
          {
            'fds-ingress--spacing': !!spacing,
          },
          className,
        )}
        {...rest}
      />
    );
  },
);

Ingress.displayName = 'Ingress';
