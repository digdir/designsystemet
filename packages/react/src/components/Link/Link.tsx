import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Link.module.css';
import { OverridableComponent } from '../../types/OverridableComponent';

export type LinkProps = {
  /** The component to render the link as. */
  as?: ElementType;

  /** The content to display inside the link. */
  children: ReactNode;

  /** Custom class name for the link. This will be appended to the design system class names. */
  className?: string;

  /** Inverts the color of the link. Use this on dark backgrounds. */
  inverted?: boolean;

  /** The URL that the link points to. This can also be an email address (starting with `mailto:`) or a phone number (staring with `tel:`). */
  href?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link: OverridableComponent<LinkProps, HTMLAnchorElement> =
  forwardRef(
    (
      { as: Component = 'a', children, className, inverted = false, ...rest },
      ref,
    ) => (
      <Component
        {...rest}
        className={cn(classes.link, inverted && classes.inverted, className)}
        ref={ref}
      >
        {children}
      </Component>
    ),
  );
