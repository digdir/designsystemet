'use client';
import { Heading } from '@digdir/designsystemet-react';
import {
  type CssColor,
  type ThemeInfo,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { Container } from '@repo/components';
import { NeutralRow } from './NeutralRow/NeutralRow';
import classes from './page.module.css';

export default function Home() {
  const generateNeutralTheme = (color: CssColor) => {
    const neutralTheme = generateColorSchemes('#1E2B3C');
    neutralTheme.light[2].hex = '#ffffff';
    neutralTheme.light[3].hex = 'rgba(0, 0, 0, 0.05)';
    neutralTheme.light[4].hex = 'rgba(0, 0, 0, 0.10)';
    neutralTheme.light[5].hex = 'rgba(0, 0, 0, 0.27)';
    neutralTheme.light[6].hex = 'rgba(0, 0, 0, 0.45)';
    neutralTheme.light[7].hex = 'rgba(0, 0, 0, 0.62)';
    neutralTheme.light[11].hex = 'rgba(0, 0, 0, 0.6)';
    neutralTheme.light[12].hex = 'rgba(0, 0, 0, 0.83)';

    neutralTheme.dark[2].hex = 'rgba(255, 255, 255, 0.06)';
    neutralTheme.dark[3].hex = 'rgba(255, 255, 255, 0.10)';
    neutralTheme.dark[4].hex = 'rgba(255, 255, 255, 0.14)';
    neutralTheme.dark[5].hex = 'rgba(255, 255, 255, 0.2)';
    neutralTheme.dark[6].hex = 'rgba(255, 255, 255, 0.4)';
    neutralTheme.dark[7].hex = 'rgba(255, 255, 255, 0.55)';
    neutralTheme.dark[11].hex = 'rgba(255, 255, 255, 0.55)';
    neutralTheme.dark[12].hex = 'rgba(255, 255, 255, 0.88)';
    return neutralTheme;
  };

  const blueTheme = generateColorSchemes('#0062BA');
  const redTheme = generateColorSchemes('#B71115');
  const greenTheme = generateColorSchemes('#11B711');
  const yellowTheme = generateColorSchemes('#E5AA20');
  const purpleTheme = generateColorSchemes('#B800E6');
  const greyTheme = generateColorSchemes('#1E2B3C');
  const neutralTheme = generateNeutralTheme('#1E2B3C');

  type RowType = {
    bgTheme: ThemeInfo;
    cardTheme: ThemeInfo;
    mode: 'light' | 'dark';
  };

  const Column = ({ bgTheme, cardTheme, mode }: RowType) => {
    return (
      <div
        className={classes.colors}
        style={{ backgroundColor: bgTheme[mode][1].hex }}
      >
        <div
          className={classes.card}
          style={{
            backgroundColor: cardTheme[mode][2].hex,
            borderColor: neutralTheme[mode][5].hex,
            color: neutralTheme[mode][12].hex,
          }}
        >
          <div style={{ color: neutralTheme[mode][12].hex }}>
            Surface default
          </div>
          <div style={{ color: neutralTheme[mode][11].hex }}>
            Surface default
          </div>
        </div>
        <div
          className={classes.card}
          style={{
            backgroundColor: cardTheme[mode][3].hex,
            borderColor: neutralTheme[mode][5].hex,
            color: neutralTheme[mode][12].hex,
          }}
        >
          <div style={{ color: neutralTheme[mode][12].hex }}>
            Surface default
          </div>
          <div style={{ color: neutralTheme[mode][11].hex }}>
            Surface default
          </div>
        </div>
        <div
          className={classes.card}
          style={{
            backgroundColor: cardTheme[mode][4].hex,
            borderColor: neutralTheme[mode][5].hex,
            color: neutralTheme[mode][12].hex,
          }}
        >
          <div style={{ color: neutralTheme[mode][12].hex }}>
            Surface default
          </div>
          <div style={{ color: neutralTheme[mode][11].hex }}>
            Surface default
          </div>
        </div>
      </div>
    );
  };

  const Row = ({ bgTheme, cardTheme, mode }: RowType) => {
    return (
      <div className={classes.row}>
        <Column bgTheme={bgTheme} cardTheme={cardTheme} mode='light' />
        <Column bgTheme={bgTheme} cardTheme={cardTheme} mode='dark' />
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <main>
        <Container>
          <Heading>Neutral surface farger på fargede bakgrunner</Heading>
          <Row bgTheme={redTheme} cardTheme={neutralTheme} mode='light' />
          <Row bgTheme={blueTheme} cardTheme={neutralTheme} mode='light' />
          <Row bgTheme={greenTheme} cardTheme={neutralTheme} mode='light' />
          <Row bgTheme={greyTheme} cardTheme={neutralTheme} mode='light' />

          <Row bgTheme={blueTheme} cardTheme={greyTheme} mode='light' />
          <Row bgTheme={greyTheme} cardTheme={greyTheme} mode='light' />

          <Row bgTheme={blueTheme} cardTheme={blueTheme} mode='light' />
          <Row bgTheme={greyTheme} cardTheme={blueTheme} mode='light' />
          <NeutralRow
            neutralTheme={neutralTheme}
            themes={[blueTheme, redTheme, greenTheme, yellowTheme, purpleTheme]}
          />
        </Container>
      </main>
    </div>
  );
}
