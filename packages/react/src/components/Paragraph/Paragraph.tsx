import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ParagraphProps = {
  /**
   * Changes text sizing
   */
  'data-size'?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
 * <Paragraph data-size='lg'>Paragraph</Paragraph>
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  function Paragraph(
    { className, asChild, variant = 'default', ...rest },
    ref,
  ) {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        className={cl(`ds-paragraph`, className)}
        data-variant={variant}
        {...rest}
      />
    );
  },
);
