'use client';

import { generateThemeForColor } from '@/packages/cli/dist/src/colors';
import { Heading } from '@digdir/designsystemet-react';
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
    const dominant = generateThemeForColor('#0062BA', 'aa');
    const secondary = generateThemeForColor('#159CDE', 'aa');
    const accent = generateThemeForColor('#F2800E', 'aa');
    const neutral = generateThemeForColor('#1E2B3C', 'aa');
    const profile1 = generateThemeForColor('#F45F63', 'aa');
    const profile2 = generateThemeForColor('#E5AA20', 'aa');

    addColor({ name: 'Dominant', colors: dominant }, 'main');
    addColor({ name: 'Sekundær', colors: secondary }, 'main');
    addColor({ name: 'Accent', colors: accent }, 'main');
    addColor({ name: 'Neutral', colors: neutral }, 'neutral');
    addColor({ name: 'Profilfarge 1', colors: profile1 }, 'support');
    addColor({ name: 'Profilfarge 2', colors: profile2 }, 'support');

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
        <Heading data-size='md'>Temabygger</Heading>
      </div>
      <Sidebar />
      <div className={classes.content}>
        <Heading data-size='sm'>Farger</Heading>
        <Colors themeMode='light' />
        <div className={classes.panel}>
          <ColorPreview />
        </div>
      </div>
    </div>
  );
}
