import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import classes from './contributors.module.css';

type ContributorsProps = {
  authors: string[];
  headingLevel?: 2 | 3 | 4;
};

export const Contributors = ({
  authors,
  headingLevel = 3,
}: ContributorsProps) => {
  const { t } = useTranslation();
  return (
    <section className={classes.container}>
      <img
        src='/img/diamond-logo.svg'
        alt='Designsystemet logo'
        className={classes.logo}
      />

      <div>
        <Heading level={headingLevel} data-size='2xs'>
          {t('contributors')}
        </Heading>
        <Paragraph data-size='sm' className={classes.meta}>
          {authors?.map((author, index) => (
            <Fragment key={index}>
              {index !== 0 && (
                <span aria-hidden className={classes.metaSquare} />
              )}
              <span>{author}</span>
            </Fragment>
          ))}
        </Paragraph>
      </div>
    </section>
  );
};
