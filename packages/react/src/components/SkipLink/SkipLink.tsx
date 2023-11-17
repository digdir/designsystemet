import type { AnchorHTMLAttributes, ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import utilityClasses from './../../utilities/utility.module.css';
import classes from './SkipLink.module.css';

export type SkipLinkProps = {
  /** The content to display inside the skiplink. */
  children: ReactNode;

  /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = ({
  href,
  children,
  ...rest
}: SkipLinkProps): JSX.Element => {
  return (
    <a
      href={href}
      {...rest}
      className={cn(
        utilityClasses.visuallyHidden,
        classes.skiplink,
        rest.className,
      )}
    >
      {children}
    </a>
  );
};
