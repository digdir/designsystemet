'use client';
import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import Link from 'next/link';
import type * as React from 'react';

import classes from './NavigationCard.module.css';

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
  url = '/grunnleggende/design-tokens',
  level = 3,
}: NavigationCardProps) => {
  return (
    <Card className={cl(classes.card, classes[backgroundColor])} asChild>
      <Link href={url} prefetch={false}>
        <div className={cl(classes.iconContainer, classes[color])}>{icon}</div>

        <Heading level={level} size='sm' className={classes.title}>
          {title}
        </Heading>

        <Paragraph size='sm' variant='long' className={classes.desc}>
          {description}
        </Paragraph>
      </Link>
    </Card>
  );
};

export { NavigationCard };
