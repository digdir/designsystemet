import type * as React from 'react';
import NextLink from 'next/link';

import classes from './Link.module.css';

import cn from 'clsx';

interface LinkProps {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  href: string;
  target?: string;
  className: string;
}

const Link = ({ href, children, prefix, target, className }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={cn(classes.link, className)}
      target={target}
    >
      {prefix && <span className={classes.prefix}>{prefix}</span>}
      {children}
    </NextLink>
  );
};

export { Link };
