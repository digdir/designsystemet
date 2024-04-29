import type { ElementType, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import classes from './Heading.module.css';

export type HeadingProps = {
  /** Heading level. This will translate into any h1-6 level unless `as` is defined */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Changes text sizing
   * @default 'xlarge'
   */
  size?:
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | '2xlarge'
    | '3xlarge';
  /** Adds margin-bottom */
  spacing?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLHeadingElement>;

/** Use `Heading` to render h1-6 elements with heading text styles.  */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 1,
      size = 'xlarge',
      spacing = false,
      className,
      asChild,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : (`h${level ?? 1}` as ElementType);

    return (
      <Component
        ref={ref}
        className={cl(
          classes.heading,
          classes[`size-${size}`],
          {
            [classes.spacing]: spacing,
          },
          className,
        )}
        {...rest}
      />
    );
  },
);

Heading.displayName = 'Heading';
