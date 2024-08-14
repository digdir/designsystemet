import { LinkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type * as React from 'react';

import type { HeadingProps } from '@digdir/designsystemet-react';
import { Heading, Link } from '@digdir/designsystemet-react';

import classes from './LinkHeading.module.css';

type LinkHeadingProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
} & Omit<HeadingProps, 'id'>;

export const LinkHeading = ({ ...rest }: LinkHeadingProps) => {
  return (
    <Heading {...rest} className={cl(classes.linkHeading, rest.className)}>
      <Link
        aria-hidden='true'
        href={`#${rest.id}`}
        tabIndex={-1}
        target='_self'
      >
        <LinkIcon />
      </Link>
      {rest.children}
    </Heading>
  );
};
