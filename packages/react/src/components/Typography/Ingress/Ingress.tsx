import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

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

/**
 * Use `Ingress` to display text as ingress.
 *
 * @example
 * <Ingress size='lg'>Ingress</Ingress>
 */
export const Ingress = forwardRef<HTMLParagraphElement, IngressProps>(
  function Ingress({ size = 'md', className, spacing, asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(`ds-ingress`, className)}
        data-size={size}
        data-spacing={spacing || undefined}
        {...rest}
      />
    );
  },
);
