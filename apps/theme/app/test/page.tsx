'use client';
import { Container } from '@repo/components';

import {
  generateTestScale,
  generateThemeForColor,
} from '@/packages/cli/dist/src';
import classes from './page.module.css';

export default function Home() {
  const oldAccentTheme = generateThemeForColor('#0062BA');
  const oldNeutralTheme = generateThemeForColor('#1E2B3C');
  const oldBrand1Theme = generateThemeForColor('#F45F63');
  const oldBrand2Theme = generateThemeForColor('#E5AA20');
  const oldBrand3Theme = generateThemeForColor('#1E98F5');

  const newAccentTheme = generateTestScale('#0062BA');

  const Row = (oldTheme, newTheme) => {
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
          <Group oldTheme={oldAccentTheme} newTheme={newAccentTheme} />
        </Container>
      </main>
    </div>
  );
}
