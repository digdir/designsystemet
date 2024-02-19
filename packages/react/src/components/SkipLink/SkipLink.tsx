import type { AnchorHTMLAttributes, ReactNode } from 'react';
import cl from 'clsx';

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
  className,
  ...rest
}: SkipLinkProps): JSX.Element => {
  return (
    <a
      href={href}
      className={cl(utilityClasses.visuallyHidden, classes.skiplink, className)}
      {...rest}
    >
      {children}
    </a>
  );
};

SkipLink.displayName = 'SkipLink';
