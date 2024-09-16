import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { ElementType, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type HeadingProps = {
  /**
   * Heading level. This will translate into any h1-6 level unless `asChild` is `true`
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Changes text sizing
   * @default 'xl'
   *
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Adds margin-bottom */
  spacing?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLHeadingElement>;

/**
 * Use `Heading` to render h1-6 elements with heading text styles.
 *
 * @example
 * <Heading size='lg' level={2}>Heading</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { size = 'xl', level = 2, spacing = false, className, asChild, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : (`h${level}` as ElementType);

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-heading',
          `ds-heading--${size}`,
          spacing && 'ds-heading--spacing',
          className,
        )}
        {...rest}
      />
    );
  },
);

Heading.displayName = 'Heading';
