import type * as React from 'react';
import NextLink from 'next/link';

import classes from './Link.module.css';

interface LinkProps {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  href: string;
  target?: string;
}

const Link = ({ href, children, prefix, target }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={classes.link}
      target={target}
    >
      {prefix && <span className={classes.prefix}>{prefix}</span>}
      {children}
    </NextLink>
  );
};

export { Link };
