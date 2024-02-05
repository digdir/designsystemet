import { DateTime } from 'luxon';
import { ExternalLinkIcon, ClockIcon } from '@navikt/aksel-icons';

import classes from './Alias.module.css';

type CardProps = {
  date: number;
  type: 'storefront' | 'storybook';
  alias: string;
};

export const Alias = ({ date, type, alias }: CardProps) => {
  return (
    <a
      className={classes.card}
      href={'https://' + alias}
      target='blank'
    >
      <div className={classes.type}>
        <img
          src={'img/' + type + '-logo.png'}
          alt=''
        />
      </div>
      <div className={classes.textContainer}>
        <h3 className={classes.title}>
          {type === 'storefront' ? 'Storefront' : 'Storybook'}
          <ExternalLinkIcon fontSize={17} />
        </h3>
        <div className={classes.date}>
          <ClockIcon fontSize={16} />
          {DateTime.fromMillis(date).toRelative()}
        </div>
      </div>
    </a>
  );
};
