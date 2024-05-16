'use client';
import type { HTMLAttributes } from 'react';
import Image from 'next/image';
import { Link } from '@digdir/designsystemet-react';
import { useRouter } from 'next/router';

export const GithubLink = ({ ...rest }: HTMLAttributes<HTMLAnchorElement>) => {
  const { asPath } = useRouter();
  const href = `https://github.com/digdir/designsystemet/tree/main/apps/storefront/pages${asPath}.mdx`;

  return (
    <Link
      href={href}
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
