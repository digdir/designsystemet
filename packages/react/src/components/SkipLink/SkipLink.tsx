import type { AnchorHTMLAttributes, ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import classes from './SkipLink.module.css';

export type SkipLinkProps = {
  /** The content to display inside the skiplink. */
  children: ReactNode;

  /** Custom class name for the skiplink. This will be appended to the design system class names. */
  className?: string;

  /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
  href?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = ({
  href,
  className,
  children,
  ...rest
}: SkipLinkProps): JSX.Element => {
  return (
    <a
      href={href}
      {...rest}
      className={cn(classes.skiplink, className)}
    >
      {children}
    </a>
  );
};
