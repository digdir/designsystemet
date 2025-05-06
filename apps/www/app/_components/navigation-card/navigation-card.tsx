'use client';
import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import type * as React from 'react';

import { Link } from 'react-router';
import classes from './navigation-card.module.css';

export interface NavigationCardProps {
  title: string;
  color?: 'red' | 'blue' | 'yellow';
  icon?: React.ReactNode;
  backgroundColor?: 'white' | 'grey';
  description?: string;
  url?: string;
  level?: 2 | 3;
}

const NavigationCard = ({
  title,
  color = 'red',
  icon,
  backgroundColor = 'white',
  description,
  url = '/fundamentals/design-tokens',
  level = 3,
}: NavigationCardProps) => {
  return (
    <Card
      className={cl(classes.card, classes[backgroundColor], 'ds-focus')}
      asChild
    >
      <Link to={url}>
        <div
          className={cl(classes.iconContainer, classes[color])}
          aria-hidden='true'
        >
          {icon}
        </div>

        <Heading level={level} data-size='sm' className={classes.title}>
          {title}
        </Heading>

        <Paragraph data-size='sm' variant='long' className={classes.desc}>
          {description}
        </Paragraph>
      </Link>
    </Card>
  );
};

export { NavigationCard };
