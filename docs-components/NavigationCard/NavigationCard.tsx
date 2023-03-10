import React, { useEffect, useState } from 'react';
import { SystemFilled } from '@navikt/ds-icons';
import cn from 'classnames';

import classes from './NavigationCard.module.css';

interface NavigationCardProps {
  name: string;
  desc: string;
  url: string;
  color?: 'red' | 'blue' | 'yellow';
  icon: React.ReactNode;
}

const NavigationCard = ({
  name,
  desc,
  url,
  color = 'red',
  icon,
}: NavigationCardProps) => {
  const [theUrl, setTheUrl] = useState('');

  useEffect(() => {
    if (window.location.href.includes('localhost')) {
      setTheUrl(url);
    } else {
      setTheUrl('/designsystem/' + url);
    }
  }, []);

  return (
    <a
      href={theUrl}
      className={classes.box}
    >
      <div
        className={cn(
          classes.iconContainer,
          classes['iconContainer--' + color],
        )}
      >
        {icon}
      </div>
      <div className={classes.name}>{name}</div>
      <div className={classes.desc}>{desc}</div>
    </a>
  );
};

export type { NavigationCardProps };
export { NavigationCard };
