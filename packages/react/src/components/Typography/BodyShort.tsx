import React, { forwardRef } from 'react';
import cl from 'clsx';
import { OverridableComponent } from '../util/OverridableComponent';

export interface BodyShortProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * medium: 18px, small: 16px
   * @default "medium"
   */
  size?: 'medium' | 'small';
  /**
   * Paragraph text
   */
  children: React.ReactNode;
  /**
   * Adds margin-bottom
   */
  spacing?: boolean;
}

export const BodyShort: OverridableComponent<
  BodyShortProps,
  HTMLParagraphElement
> = forwardRef(
  (
    { className, size = 'medium', spacing, as: Component = 'p', ...rest },
    ref,
  ) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(className, 'body-short', {
        'body-short--small': size === 'small',
        'typo--spacing': !!spacing,
      })}
    />
  ),
);

export default BodyShort;
