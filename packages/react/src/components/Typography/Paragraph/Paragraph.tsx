import styles from '@digdir/designsystemet-css/baseline/typography/paragraph.module.css';
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
          styles['ds-paragraph'],
          spacing && styles['ds-paragraph--spacing'],
          styles[`ds-paragraph--${size}`],
          styles[lineHeightMap[variant ?? 'default'] as keyof typeof styles],
          className,
        )}
        {...rest}
      />
    );
  },
);

Paragraph.displayName = 'Paragraph';
