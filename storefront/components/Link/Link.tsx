import React from 'react';
import NextLink from 'next/link';

import classes from './Link.module.css';

interface LinkProps {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  href: string;
}

const Link = ({ href, children, prefix }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={classes.link}
    >
      {prefix && <span className={classes.prefix}>{prefix}</span>}
      {children}
    </NextLink>
  );
};

export { Link };
