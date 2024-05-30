'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';
import { Heading } from '@/packages/react';

import { generateColorTheme } from '../../utils/themeUtils';
import { Header } from '../components/Header/Header';
import { Container } from '../components/Container/Container';
import { Settings } from '../settings';

import { ContrastBox } from './ContrastBox/ContrastBox';
import classes from './page.module.css';
import { BaseContrast } from './BaseContrast/BaseContrast';
import { BackgroundSurface } from './BackgroundSurface/BackgroundSurface';
import { Interaction } from './Interaction/Interaction';
import { Backgrounds } from './Backgrounds/Backgrounds';

const Box = (name: string, color1: CssColor, color2: CssColor) => {
  return (
    <div className={classes.box}>
      <div
        className={classes.color}
        style={{ backgroundColor: color1 }}
      />
      <div className={classes.test}>
        <div className={classes.name}>{name}</div>
        <div>{ContrastBox(color1, color2)}</div>
      </div>
    </div>
  );
};

const Row = (title: string, colors: CssColor[], whiteText: boolean = false) => {
  return (
    <div className={cl(whiteText && classes.whiteText)}>
      <Heading
        size='xsmall'
        className={classes.mainTitle}
      >
        {title}
      </Heading>
      <div className={classes.row}>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[0] }}
        >
          <Heading
            size='xxsmall'
            className={classes.title}
          >
            Background default
          </Heading>
          {Box('Border subtle', colors[5], colors[0])}
          {Box('Border default', colors[6], colors[0])}
          {Box('Border strong', colors[7], colors[0])}
          {Box('Text subtle', colors[11], colors[0])}
          {Box('Text default', colors[12], colors[0])}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[1] }}
        >
          <Heading
            size='xxsmall'
            className={classes.title}
          >
            Background subtle
          </Heading>
          {Box('Border subtle', colors[5], colors[1])}
          {Box('Border default', colors[6], colors[1])}
          {Box('Border strong', colors[7], colors[1])}
          {Box('Text subtle', colors[11], colors[1])}
          {Box('Text default', colors[12], colors[1])}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[2] }}
        >
          <Heading
            size='xxsmall'
            className={classes.title}
          >
            Surface default
          </Heading>
          {Box('Border subtle', colors[5], colors[2])}
          {Box('Border default', colors[6], colors[2])}
          {Box('Border strong', colors[7], colors[2])}
          {Box('Text subtle', colors[11], colors[2])}
          {Box('Text default', colors[12], colors[2])}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[3] }}
        >
          <Heading
            size='xxsmall'
            className={classes.title}
          >
            Surface hover
          </Heading>
          {Box('Border subtle', colors[5], colors[3])}
          {Box('Border default', colors[6], colors[3])}
          {Box('Border strong', colors[7], colors[3])}
          {Box('Text subtle', colors[11], colors[3])}
          {Box('Text default', colors[12], colors[3])}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[4] }}
        >
          <Heading
            size='xxsmall'
            className={classes.title}
          >
            Surface active
          </Heading>
          {Box('Border subtle', colors[5], colors[4])}
          {Box('Border default', colors[6], colors[4])}
          {Box('Border strong', colors[7], colors[4])}
          {Box('Text subtle', colors[11], colors[4])}
          {Box('Text default', colors[12], colors[4])}
        </div>
      </div>
    </div>
  );
};

export default function Dev() {
  const theme1 = generateColorTheme('#0062BA');
  const theme2 = generateColorTheme('#1E98F5');
  const theme3 = generateColorTheme('#E5AA20');
  const theme4 = generateColorTheme('#f3e02e');
  const theme5 = generateColorTheme('#DE251B');
  const theme6 = generateColorTheme('#F45F63');
  const theme7 = generateColorTheme('#054449');
  const theme8 = generateColorTheme('#7befb2');
  const theme9 = generateColorTheme('#410464');
  const theme10 = generateColorTheme('#A845E1');
  const theme11 = generateColorTheme('#109E96');
  const theme12 = generateColorTheme('#243142');

  const themeGlobalBlue = generateColorTheme(Settings.blueBaseColor);
  const themeGlobalGreen = generateColorTheme(Settings.greenBaseColor);
  const themeGlobalOrange = generateColorTheme(Settings.orangeBaseColor);
  const themeGlobalRed = generateColorTheme(Settings.redBaseColor);
  const themeGlobalPurple = generateColorTheme(Settings.purpleBaseColor);
  const themeGlobalYellow = generateColorTheme(Settings.yellowBaseColor);

  return (
    <div className={classes.page}>
      <Header />
      <Container>
        <Heading
          size='large'
          className={classes.pageTitle}
        >
          Fargekontrast og visuell vurdering
        </Heading>
        <div className={classes.dotMeaning}>
          <div className={classes.dotMeaningItem}>
            <div
              className={cl(classes.dotMeaningDot, classes.dotMeaningDotGreen)}
            />
            <div className={classes.dotMeadingTitle}>4.5:1 - Tekst</div>
          </div>
          <div className={classes.dotMeaningItem}>
            <div
              className={cl(classes.dotMeaningDot, classes.dotMeaningDotOrange)}
            />
            <div className={classes.dotMeadingTitle}> 3:1 - Dekorativ</div>
          </div>
          <div className={classes.dotMeaningItem}>
            <div
              className={cl(classes.dotMeaningDot, classes.dotMeaningDotRed)}
            />
            <div className={classes.dotMeadingTitle}>Under dekorativ</div>
          </div>
        </div>
        <Heading
          className={classes.sectionTitle}
          size='medium'
        >
          Background Default og Subtle
        </Heading>
        <Backgrounds
          theme1={theme12}
          theme2={theme2}
          theme3={theme7}
          theme4={theme5}
        />
        <Heading
          className={classes.sectionTitle}
          size='medium'
        >
          Background Subtle mot Surface Default
        </Heading>
        <BackgroundSurface
          theme1={theme1}
          theme2={theme2}
          theme3={theme3}
          theme4={theme4}
          theme5={theme5}
          theme6={theme6}
          theme7={theme7}
          theme8={theme8}
        />
        <Heading
          className={classes.sectionTitle}
          size='medium'
        >
          Surface og Base interaksjon
        </Heading>
        <div className={classes.sectionDesc}>
          Denne oversikten viser Default, Hover og Active states til Surface og
          Base fargene via interaksjon. Teksten bruker
          <code>Contrast 1</code> fargen.
        </div>
        <Interaction
          theme1={theme1}
          theme2={theme2}
          theme3={theme3}
          theme4={theme4}
          theme5={theme5}
          theme6={theme6}
          theme7={theme7}
          theme8={theme8}
          theme9={theme9}
          theme10={theme10}
          theme11={theme11}
          theme12={theme12}
        />
        <Heading
          className={classes.sectionTitle}
          size='medium'
        >
          Kontrastfarger mot Base
        </Heading>
        <ul>
          <li>
            <code>Contrast 1</code> skal ha minst 4.5:1 kontrast mot
            <code>Base active</code>.
          </li>
          <li>
            <code>Contrast 2</code> skal ha minst 4.5:1 kontrast mot
            <code>Base default</code>.
          </li>
          <li>
            <code>Contrast 2</code> skal ha minst 3:1 kontrast mot
            <code>Base active</code>.
          </li>
        </ul>
        <BaseContrast
          themes={[
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme1,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme2,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme3,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme4,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme5,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme6,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme7,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme8,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme9,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme10,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme11,
            },
            {
              title: 'Base: ' + theme1.light[8],
              theme: theme12,
            },
            {
              title: 'Global BLue',
              theme: themeGlobalBlue,
            },
            {
              title: 'Global Green',
              theme: themeGlobalGreen,
            },
            {
              title: 'Global Orange',
              theme: themeGlobalOrange,
            },
            {
              title: 'Global Red',
              theme: themeGlobalRed,
            },
            {
              title: 'Global Purple',
              theme: themeGlobalPurple,
            },
            {
              title: 'Global Yellow',
              theme: themeGlobalYellow,
            },
          ]}
        />
        <Heading
          className={classes.sectionTitle}
          size='medium'
        >
          Background og Surface mot Border og Tekst
        </Heading>
        <ul>
          <li>
            <code>Border strong</code> og
            <code>Text default</code> skal ha minst 4.5:1 kontrast mot
            <code>Surface active</code>.
          </li>
          <li>
            <code>Text subtle</code> skal ha minst 4.5:1 kontrast mot
            <code>Surface default</code>.
          </li>
          <li>
            <code>Border default</code> skal ha minst 3:1 kontrast mot
            <code>Background subtle</code>.
          </li>

          <li>
            <code>Border subtle</code> skal ha minst 3:1 kontrast mot
            <code>Surface active</code> i contrast mode.
          </li>
          <li>
            <code>Border default</code> skal ha minst 4.5:1 kontrast mot
            <code>Surface active</code> i contrast mode.
          </li>
        </ul>
        {Row('Light', theme1.light)}
        {Row('Dark', theme1.dark, true)}
        {Row('Contrast', theme1.contrast, true)}
      </Container>
    </div>
  );
}
