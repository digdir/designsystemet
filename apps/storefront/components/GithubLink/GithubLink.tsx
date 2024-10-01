'use client';
import { Link } from '@digdir/designsystemet-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { HTMLAttributes } from 'react';

const GithubLink = ({
  ...rest
}: Omit<HTMLAttributes<HTMLAnchorElement>, 'color'>) => {
  const pathName = usePathname();
  const href = `https://github.com/digdir/designsystemet/tree/next/apps/storefront/app${pathName}/page.mdx`;

  return (
    <Link href={href} target='_blank' rel='noopener noreferrer' {...rest}>
      <Image
        height={20}
        width={20}
        alt='github logo'
        src='/img/logos/github-logo.svg'
      />
      Rediger denne siden på Github (åpnes i ny fane)
    </Link>
  );
};

export { GithubLink };
