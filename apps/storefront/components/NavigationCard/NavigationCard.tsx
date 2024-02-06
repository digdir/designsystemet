import Link from 'next/link';
import cl from 'clsx';
import type * as React from 'react';

import classes from './NavigationCard.module.css';

export interface NavigationCardProps {
  title: string;
  color?: 'red' | 'blue' | 'yellow';
  icon?: React.ReactNode;
  backgroundColor?: 'white' | 'grey';
  description?: string;
  url?: string;
}

const NavigationCard = ({
  title,
  color = 'red',
  icon,
  backgroundColor = 'white',
  description,
  url = '/grunnleggende/design-tokens',
}: NavigationCardProps) => {
  return (
    <Link
      href={url}
      prefetch={false}
      className={cl(classes.card, classes[backgroundColor])}
    >
      <div className={cl(classes.iconContainer, classes[color])}>{icon}</div>
      <h3 className={classes.title}>{title}</h3>
      <div className={classes.desc}>{description}</div>
    </Link>
  );
};

export { NavigationCard };
