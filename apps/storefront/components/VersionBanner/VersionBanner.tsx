import cl from 'clsx/lite';
import React from 'react';
import classes from './VersionBanner.module.css';

function VersionBanner() {
  return (
    <a
      href='https://v0.designsystemet.no'
      className={cl(classes.banner, 'ds-focus')}
    >
      Gå til dokumentasjon for v0.63
    </a>
  );
}

export { VersionBanner };
