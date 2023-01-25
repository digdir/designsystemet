import React, { useEffect, useState } from 'react';
import { SystemFilled } from '@navikt/ds-icons';

import classes from './NavigationCard.module.css';

interface NavigationCardProps {
  name: string;
  desc: string;
  url: string;
}

const NavigationCard = ({ name, desc, url }: NavigationCardProps) => {
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
      <div className={classes.iconContainer}>
        <SystemFilled fontSize={23} />
      </div>
      <div className={classes.name}>{name}</div>
      <div className={classes.desc}>{desc}</div>
    </a>
  );
};

export type { NavigationCardProps };
export { NavigationCard };
