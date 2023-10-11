import React from 'react';
import classes from './Alias.module.css';
import { DateTime } from 'luxon';
import { ExternalLinkIcon, ClockIcon } from '@navikt/aksel-icons';

type CardProps = {
  date: number;
  type: 'storefront' | 'storybook';
  alias: string;
};

export const Alias = ({ date, type, alias }: CardProps) => {
  return (
    <div className={classes.card}>
      <div className={classes.type}>
        <img
          src={'img/' + type + '-logo.png'}
          alt=''
        />
      </div>
      <div className={classes.textContainer}>
        <h3 className={classes.title}>
          {type === 'storefront' ? 'Storefront' : 'Storybook'}

          <a
            href={'https://' + alias}
            target='blank'
            className={classes.alias}
          >
            <ExternalLinkIcon fontSize={17} />
          </a>
        </h3>
        <div className={classes.date}>
          <ClockIcon fontSize={16} />
          {DateTime.fromMillis(date).toRelative()}
        </div>
      </div>
    </div>
  );
};
