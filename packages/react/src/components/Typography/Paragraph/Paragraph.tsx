import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type ParagraphProps = {
  /**
   * Changes text sizing
   *
   * @default `md`
   *
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Adjusts styling for paragraph length */
  variant?: 'long' | 'short';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `Paragraph` to display text with paragraph text styles. */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, spacing, size = 'md', asChild, variant, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-paragraph',
          `ds-paragraph--${size}`,
          spacing && 'ds-paragraph--spacing',
          variant && `ds-paragraph--${variant}`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Paragraph.displayName = 'Paragraph';
