'use client';
import { Link } from '@digdir/designsystemet-react';
import { Github } from '@repo/components';
import { usePathname } from 'next/navigation';
import type { HTMLAttributes } from 'react';

const GithubLink = ({
  ...rest
}: Omit<HTMLAttributes<HTMLAnchorElement>, 'color'>) => {
  const pathName = usePathname();
  const href = `https://github.com/digdir/designsystemet/tree/next/apps/storefront/app${pathName}/page.mdx`;

  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      {...rest}
      data-unstyled
    >
      <Github />
      Rediger denne siden på Github (åpnes i ny fane)
    </Link>
  );
};

export { GithubLink };
