import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ParagraphProps = {
  /**
   * Changes text sizing
   *
   * @default 'md'
   *
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Adds margin-bottom */
  spacing?: boolean;
  /**
   *  Adjusts styling for paragraph length
   *  @default 'default'
   */
  variant?: 'long' | 'default' | 'short';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;
/**
 * Use `Paragraph` to display text with paragraph text styles.
 *
 * @example
 * <Paragraph size='lg'>Paragraph</Paragraph>
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    { className, spacing, size = 'md', asChild, variant = 'default', ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(
          `ds-body--${variant !== 'default' ? `${variant}-` : ''}${size}`,
          spacing && 'ds-body--spacing',
          className,
        )}
        {...rest}
      />
    );
  },
);

Paragraph.displayName = 'Paragraph';
