'use client';
import { Heading } from '@digdir/designsystemet-react';
import {
  type ThemeInfo,
  generateColorSchemes,
  generateNeutralColorSchemes,
} from '@digdir/designsystemet/color';
import { Container } from '@repo/components';
import { NeutralRow } from './NeutralRow/NeutralRow';
import classes from './page.module.css';

export default function Home() {
  const blueTheme = generateColorSchemes('#0062BA');
  const redTheme = generateColorSchemes('#B71115');
  const greenTheme = generateColorSchemes('#11B711');
  const yellowTheme = generateColorSchemes('#E5AA20');
  const purpleTheme = generateColorSchemes('#B800E6');
  const greyTheme = generateColorSchemes('#1E2B3C');
  const neutralTheme = generateNeutralColorSchemes();

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
