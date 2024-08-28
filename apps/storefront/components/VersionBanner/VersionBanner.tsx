import cl from 'clsx/lite';
import React from 'react';
import classes from './VersionBanner.module.css';

function VersionBanner() {
  return (
    <a
      href='https://v0.designsystemet.no'
      className={cl(classes.banner, 'ds-focus')}
    >
      Trykk her for dokumentasjon av v0.63.
    </a>
  );
}

export { VersionBanner };
