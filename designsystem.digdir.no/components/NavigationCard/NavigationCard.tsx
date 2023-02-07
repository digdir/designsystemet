import classes from './NavigationCard.module.css';
import Link from 'next/link';

import cn from 'classnames';
import React from 'react';

interface NavigationCardProps {
  title: string;
  color: 'red' | 'blue' | 'yellow';
  icon: React.ReactNode;
  backgroundColor?: 'white' | 'grey';
  url?: string;
}

const NavigationCard = ({
  title,
  color = 'red',
  icon,
  backgroundColor = 'white',
  url = '/grunnleggende/design-tokens',
}: NavigationCardProps) => {
  return (
    <Link
      href={url}
      className={cn(classes.card, classes[backgroundColor])}
    >
      <div className={cn(classes.iconContainer, classes[color])}>{icon}</div>
      <h3 className={classes.title}>{title}</h3>
      <div className={classes.desc}>
        For its there not will times coast at when the outcomes clock
        intermixing ages, what he lift however rather believed
      </div>
    </Link>
  );
};

export default NavigationCard;
