import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { Fragment } from 'react';

import classes from './Contributors.module.css';

type ContributorsProps = {
  authors: string[];
};

export const Contributors = ({ authors }: ContributorsProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <img
          src='/img/diamond-logo.svg'
          alt='Designsystemet logo'
          className={classes.logoImage}
        />
      </div>
      <Heading level={3} size='2xs'>
        Bidragsytere
      </Heading>
      <Paragraph size='sm' className={classes.meta}>
        {authors?.map((author, index) => (
          <Fragment key={index}>
            {index !== 0 && <span aria-hidden className={classes.metaSquare} />}
            <span>{author}</span>
          </Fragment>
        ))}
      </Paragraph>
    </div>
  );
};
