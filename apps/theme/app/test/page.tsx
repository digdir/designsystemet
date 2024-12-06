'use client';
import { Container } from '@repo/components';

import { type ThemeInfo, generateThemeForColor } from '@digdir/designsystemet/color';
import classes from './page.module.css';

export default function Home() {
  const oldAccentTheme = generateThemeForColor('#0062BA');
  const oldNeutralTheme = generateThemeForColor('#1E2B3C');
  const oldBrand1Theme = generateThemeForColor('#F45F63');
  const oldBrand2Theme = generateThemeForColor('#E5AA20');
  const oldBrand3Theme = generateThemeForColor('#1E98F5');

  type RowType = {
    oldTheme: ThemeInfo;
    mode: 'light' | 'dark';
  };

  const Row = ({ oldTheme, mode }: RowType) => {
    return (
      <div className={classes.group}>
        <div className={classes.colors}>
          {oldTheme[mode].map((color, index) => (
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
          <Row oldTheme={oldAccentTheme} mode='light' />
          <Row oldTheme={oldNeutralTheme} mode='light' />
          <Row oldTheme={oldBrand1Theme} mode='light' />
          <Row oldTheme={oldBrand2Theme} mode='light' />
          <Row oldTheme={oldBrand3Theme} mode='light' />

          <Row oldTheme={oldAccentTheme} mode='dark' />
          <Row oldTheme={oldNeutralTheme} mode='dark' />
          <Row oldTheme={oldBrand1Theme} mode='dark' />
          <Row oldTheme={oldBrand2Theme} mode='dark' />
          <Row oldTheme={oldBrand3Theme} mode='dark' />
        </Container>
      </main>
    </div>
  );
}
