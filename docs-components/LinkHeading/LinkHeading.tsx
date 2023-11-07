import { Heading, Link } from '@digdir/design-system-react';
import type { HeadingProps } from '@digdir/design-system-react';
import { LinkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import React from 'react';

import classes from './LinkHeading.module.css';

type LinkHeadingProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
} & Omit<HeadingProps, 'id'>;

export const LinkHeading = ({ ...rest }: LinkHeadingProps) => {
  return (
    <Heading
      {...rest}
      className={cn(classes.linkHeading, rest.className)}
    >
      <Link
        aria-hidden='true'
        href={`#${rest.id}`}
        tabindex='-1'
        target='_self'
      >
        <LinkIcon />
      </Link>
      {rest.children}
    </Heading>
  );
};
