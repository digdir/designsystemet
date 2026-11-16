import { Heading, Link } from '@digdir/designsystemet-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ownThemeDocsUrl } from '~/_utils/docs-url';
import classes from './page-header.module.css';

type PageHeaderProps = {
  /** Shown at the bottom of the header, below the title and the docs link */
  children?: ReactNode;
};

/** The band at the top of the page, with the title and the link to the documentation */
export const PageHeader = ({ children }: PageHeaderProps) => {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <div className={classes.header}>
      <div className={classes.headerContent}>
        <div className={classes.textContainer}>
          <Heading data-size='md' level={1}>
            {t('themeBuilder.title')}
          </Heading>
          <Link className={classes.docsLink} href={ownThemeDocsUrl(lang)}>
            {t('themeBuilder.documentation-link')}
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};
