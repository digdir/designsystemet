import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getSize } from '../../../utilities/getSize';

type OldParagraphSizes = 'xsmall' | 'small' | 'medium' | 'large';

export type ParagraphProps = {
  /**
   * Changes text sizing
   *
   * @default `md`
   *
   * @note `xsmall`, `small`, `medium`, `large` is deprecated
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | OldParagraphSizes;
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
  ({ className, spacing, asChild, variant, ...rest }, ref) => {
    const Component = asChild ? Slot : 'p';
    const size = getSize(rest.size || 'md');

    return (
      <Component
        ref={ref}
        className={cl(
          'fds-paragraph',
          `fds-paragraph--${size}`,
          spacing && 'fds-paragraph--spacing',
          variant && `fds-paragraph--${variant}`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Paragraph.displayName = 'Paragraph';
