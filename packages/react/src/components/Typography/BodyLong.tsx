import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../utils/OverridableComponent';

export interface BodyLongProps
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

export const BodyLong: OverridableComponent<
  BodyLongProps,
  HTMLParagraphElement
> = forwardRef(
  (
    { className, size = 'medium', spacing, as: Component = 'p', ...rest },
    ref,
  ) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(className, 'body-long', {
        'body-long--small': size === 'small',
        'typo--spacing': !!spacing,
      })}
    />
  ),
);

export default BodyLong;
