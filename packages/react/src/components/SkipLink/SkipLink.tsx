import type { AnchorHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './SkipLink.module.css';

export type SkipLinkProps = {
  /** The content to display inside the link. */
  children: ReactNode;

  /** Custom class name for the link. This will be appended to the design system class names. */
  className?: string;

  href?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink: OverridableComponent<SkipLinkProps, HTMLAnchorElement> =
  forwardRef(({ as: Component = 'a', children, className, ...rest }, ref) => (
    <Component
      {...rest}
      className={cn(classes.skiplink, className)}
      ref={ref}
    >
      {children}
    </Component>
  ));
