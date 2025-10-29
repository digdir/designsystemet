import { Link, type LinkProps } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Github } from '../logos/github';
import classes from './edit-page-on-github.module.css';

export const EditPageOnGithub = ({
  className,
  href,
  ...rest
}: Omit<LinkProps, 'children'>) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pathParts = pathname.split('/');
  const lang = pathParts[1];
  const page = pathParts[2];
  /* make sure restpath does not end with / */
  const restPath = pathParts.slice(3).join('/').endsWith('/')
    ? pathParts.slice(3).join('/').slice(0, -1)
    : pathParts.slice(3).join('/');

  const genRef = href
    ? href
    : `https://github.com/digdir/designsystemet/tree/main/apps/www/app/content/${page}/${lang}/${restPath}.mdx`;

  return (
    <Link
      href={genRef}
      target='_blank'
      rel='noopener noreferrer'
      {...rest}
      className={cl(classes.githubLink, className)}
    >
      <Github aria-hidden='true' />
      {t('editOnGithub')}
    </Link>
  );
};
