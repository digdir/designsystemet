import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Fragment } from 'react';

import classes from './contributors.module.css';

type ContributorsProps = {
  authors: string[];
  headingLevel?: 2 | 3 | 4;
};

export const Contributors = ({
  authors,
  headingLevel = 3,
}: ContributorsProps) => {
  return (
    <section className={classes.container}>
      <div className={classes.logo}>
        <img
          src='/img/diamond-logo.svg'
          alt='Designsystemet logo'
          className={classes.logoImage}
        />
      </div>
      <Heading level={headingLevel} data-size='2xs'>
        Bidragsytere
      </Heading>
      <Paragraph data-size='sm' className={classes.meta}>
        {authors?.map((author, index) => (
          <Fragment key={index}>
            {index !== 0 && <span aria-hidden className={classes.metaSquare} />}
            <span>{author}</span>
          </Fragment>
        ))}
      </Paragraph>
    </section>
  );
};
