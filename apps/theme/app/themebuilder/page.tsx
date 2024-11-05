'use client';

import { Heading } from '@digdir/designsystemet-react';
import { Scales } from '../../components';
import classes from './page.module.css';

export default function Home() {
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <Heading data-size='lg'>Temabygger</Heading>
      </div>
      <div className={classes.sidebar}>
        <Heading data-size='sm'>Konfigurer tema</Heading>
      </div>
      <div className={classes.content}>
        <Heading data-size='md'>Farger</Heading>
        <div className={classes.panel}>
          <Scales themeMode='light' />
        </div>
      </div>
    </div>
  );
}
