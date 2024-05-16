import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import { getSize } from '../../../utilities/getSize';

type OldIngressSizes = 'large' | 'medium' | 'small' | 'xsmall';

export type IngressProps = {
  /** Changes text sizing
   * @default md
   * @note `xsmall`, `small`, `medium`, `large` is deprecated
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | OldIngressSizes;
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
  ({ className, spacing, asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';
    const size = getSize(rest.size || 'md');

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
