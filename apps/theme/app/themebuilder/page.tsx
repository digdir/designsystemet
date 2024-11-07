'use client';

import { generateThemeForColor } from '@/packages/cli/dist/src/colors';
import { Heading } from '@digdir/designsystemet-react';
import { useEffect } from 'react';
import { Colors, Sidebar } from '../../components';
import { useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Home() {
  const addMainColor = useThemeStore((state) => state.addMainColor);
  const setMainColors = useThemeStore((state) => state.setMainColors);

  useEffect(() => {
    const dominant = generateThemeForColor('#0062BA', 'aa');
    const secondary = generateThemeForColor('#159CDE', 'aa');
    const accent = generateThemeForColor('#F2800E', 'aa');

    addMainColor({ name: 'Dominant', colors: dominant });
    addMainColor({ name: 'Sekundær', colors: secondary });
    addMainColor({ name: 'Accent', colors: accent });

    return () => {
      // Set main colors to empty array when component unmounts
      setMainColors([]);
    };
  }, []);

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <Heading data-size='lg'>Temabygger</Heading>
      </div>
      <Sidebar />
      <div className={classes.content}>
        <Heading data-size='md'>Farger</Heading>
        <div className={classes.panel}>
          <Colors themeMode='light' />
        </div>
      </div>
    </div>
  );
}
