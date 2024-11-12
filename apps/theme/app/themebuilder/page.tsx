'use client';

import { generateThemeForColor } from '@/packages/cli/dist/src/colors';
import { Heading, Link } from '@digdir/designsystemet-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useEffect } from 'react';
import { ColorPreview, Colors, Sidebar } from '../../components';
import { useThemeStore } from '../../store';
import classes from './page.module.css';

export default function Home() {
  const colors = useThemeStore((state) => state.colors);
  const addColor = useThemeStore((state) => state.addColor);
  const resetColors = useThemeStore((state) => state.resetColors);
  const appearance = useThemeStore((state) => state.appearance);

  useEffect(() => {
    const dominant = generateThemeForColor('#0062BA');
    const secondary = generateThemeForColor('#159CDE');
    const accent = generateThemeForColor('#F2800E');
    const neutral = generateThemeForColor('#1E2B3C');
    const profile1 = generateThemeForColor('#F45F63');
    const profile2 = generateThemeForColor('#E5AA20');

    addColor({ name: 'Dominant', colors: dominant }, 'main');
    addColor({ name: 'Secondary', colors: secondary }, 'main');
    addColor({ name: 'Accent', colors: accent }, 'main');
    addColor({ name: 'Neutral', colors: neutral }, 'neutral');
    addColor({ name: 'Profilecolor 1', colors: profile1 }, 'support');
    addColor({ name: 'Profilecolor 2', colors: profile2 }, 'support');

    return () => {
      // Set colors to empty array when component unmounts
      resetColors();
    };
  }, []);

  type TestProps = 'light' | 'dark';

  const setHeaderColor = () => {
    let themeMode: TestProps = 'light';
    if (colors.main.length === 0) {
      return '#D9D9D9';
    }
    if (appearance === 'dark') {
      themeMode = 'dark';
    }
    const str = colors.main[0].colors[themeMode][3].hex;
    if (colors.main.length > 1) {
      return (
        'linear-gradient(90deg, ' +
        colors.main[0].colors[themeMode][3].hex +
        ' 0%, ' +
        colors.main[1].colors[themeMode][3].hex +
        ' 60%)'
      );
    }
    return str;
  };

  return (
    <div className={classes.page}>
      <div className={classes.header} style={{ background: setHeaderColor() }}>
        <div>
          <Link data-size='sm' className={classes.backLink} asChild>
            <NextLink href='/'>
              <ChevronLeftIcon title='a11y-title' fontSize='1.5rem' />
              Gå tilbake til framsiden
            </NextLink>
          </Link>
        </div>
        <Heading data-size='md'>Temabygger</Heading>
      </div>
      <div className={classes.container}>
        <div className={classes.content}>
          <Heading data-size='sm'>Farger</Heading>
          <div className={classes.colorsContainer}>
            <Colors themeMode='light' />
          </div>
          <div className={classes.panel}>
            <ColorPreview />
          </div>
        </div>
        <div className={classes.sideBarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
