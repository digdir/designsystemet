'use client';
import Link from 'next/link';
import cl from 'clsx/lite';
import type * as React from 'react';
import { Heading } from '@digdir/designsystemet-react';

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
    <Link
      href={url}
      prefetch={false}
      className={cl(classes.card, classes[backgroundColor], 'ds-focus')}
    >
      <div className={cl(classes.iconContainer, classes[color])}>{icon}</div>
      <Heading
        level={level}
        size='sm'
        className={classes.title}
      >
        {title}
      </Heading>
      <div className={cl(classes.desc, 'ds-paragraph-sm')}>{description}</div>
    </Link>
  );
};

export { NavigationCard };
