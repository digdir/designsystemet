import type { AnchorHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Link.module.css';

export type LinkProps = {
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
        className={cl(classes.link, inverted && classes.inverted, className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    ),
  );
