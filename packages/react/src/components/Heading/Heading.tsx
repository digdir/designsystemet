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
   */
  'data-size'?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
 * <Heading data-size='lg' level={2}>Heading</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, className, asChild, ...rest }, ref) {
    const Component = asChild ? Slot : (`h${level}` as ElementType);

    return (
      <Component className={cl(`ds-heading`, className)} ref={ref} {...rest} />
    );
  },
);
