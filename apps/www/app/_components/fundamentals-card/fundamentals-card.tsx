import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type * as React from 'react';

import { RRLink } from '../link';
import classes from './fundamentals-card.module.css';

export interface FundamentalsCardProps {
  title: string;
  color?: 'red' | 'blue' | 'yellow';
  icon?: React.ReactNode;
  backgroundColor?: 'white' | 'grey';
  description?: string;
  url?: string;
  level?: 2 | 3;
}

const FundamentalsCard = ({
  title,
  color = 'red',
  icon,
  description,
  url = '/fundamentals/design-elements',
  level = 3,
}: FundamentalsCardProps) => {
  const iconColor =
    color === 'red' ? 'danger' : color === 'blue' ? 'accent' : 'warning';
  return (
    <Card className={cl(classes.card)} asChild>
      <article>
        <div
          data-color={iconColor}
          className={cl(classes.iconContainer)}
          aria-hidden='true'
        >
          {icon}
        </div>
        <div>
          <Heading level={level} data-size='xs' className={classes.title}>
            <RRLink to={url}>{title}</RRLink>
          </Heading>
          <Paragraph data-size='sm' variant='long' className={classes.desc}>
            {description}
          </Paragraph>
        </div>
      </article>
    </Card>
  );
};

export { FundamentalsCard };
