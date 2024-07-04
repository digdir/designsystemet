import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

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

const lineHeightMap = {
  short: 'ds-line-height--sm',
  default: 'ds-line-height--md',
  long: 'ds-line-height--lg',
};

/**
 * Use `Paragraph` to display text with paragraph text styles.
 *
 * @example
 * <Paragraph size='lg'>Paragraph</Paragraph>
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, spacing, size = 'md', asChild, variant, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-paragraph',
          spacing && 'ds-paragraph--spacing',
          `ds-paragraph--${size}`,
          lineHeightMap[variant ?? 'default'],
          className,
        )}
        {...rest}
      />
    );
  },
);

Paragraph.displayName = 'Paragraph';
