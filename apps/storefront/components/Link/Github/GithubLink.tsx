'use client';
import type { HTMLAttributes } from 'react';
import React from 'react';
import Image from 'next/image';
import { Link } from '@digdir/design-system-react';

type GithubLinkProps = HTMLAttributes<HTMLAnchorElement>;

export const GithubLink = ({ ...rest }: GithubLinkProps) => {
  return (
    <Link
      href='https://github.com/digdir/designsystemet/tree/main/apps/storefront/pages'
      target='_blank'
      rel='noopener noreferrer'
      {...rest}
    >
      <Image
        height={20}
        width={20}
        alt='github logo'
        src='/img/logos/github-logo.svg'
      />
      Rediger denne siden på Github
    </Link>
  );
};

export default GithubLink;
