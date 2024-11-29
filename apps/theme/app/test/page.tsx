'use client';
import { Container } from '@repo/components';

import {
  type ThemeInfo,
  generateTestTheme,
  generateThemeForColor,
} from '@/packages/cli/dist/src';
import classes from './page.module.css';

export default function Home() {
  const oldAccentTheme = generateThemeForColor('#0062BA');
  const oldNeutralTheme = generateThemeForColor('#1E2B3C');
  const oldBrand1Theme = generateThemeForColor('#F45F63');
  const oldBrand2Theme = generateThemeForColor('#E5AA20');
  const oldBrand3Theme = generateThemeForColor('#1E98F5');

  const newAccentTheme = generateTestTheme('#0062BA', 'light');

  type RowType = {
    oldTheme: ThemeInfo;
    newTheme: ThemeInfo;
  };

  const Row = ({ oldTheme, newTheme }: RowType) => {
    return (
      <div className={classes.group}>
        <div className={classes.colors}>
          {oldTheme.light.map((color, index) => (
            <div
              className={classes.color}
              key={index}
              style={{ backgroundColor: color.hex }}
            ></div>
          ))}
        </div>
        <div className={classes.colors}>
          {newTheme.light.map((color, index) => (
            <div
              className={classes.color}
              key={index}
              style={{ backgroundColor: color.hex }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <main>
        <Container>
          <Row oldTheme={oldAccentTheme} newTheme={newAccentTheme} />
        </Container>
      </main>
    </div>
  );
}
