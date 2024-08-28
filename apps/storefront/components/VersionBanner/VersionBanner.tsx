import React from 'react';
import classes from './VersionBanner.module.css';

function VersionBanner() {
  return (
    <a href='https://v0.designsystemet.no' className={classes.banner}>
      Trykk her for dokumentasjon av v0.63.
    </a>
  );
}

export { VersionBanner };
