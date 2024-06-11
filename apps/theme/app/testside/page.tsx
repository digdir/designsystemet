'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';
import { Heading } from '@digdir/designsystemet-react';

import type { ColorInfoType } from '../../utils/themeUtils';
import { generateThemeForColor } from '../../utils/themeUtils';
import { Settings } from '../../settings';
import { Header, Container } from '../../components';

import { ContrastBox } from './ContrastBox/ContrastBox';
import classes from './page.module.css';
import { BaseContrast } from './BaseContrast/BaseContrast';
import { BackgroundSurface } from './BackgroundSurface/BackgroundSurface';
import { Interaction } from './Interaction/Interaction';
import { Backgrounds } from './Backgrounds/Backgrounds';
import { BaseContrastOverview } from './BaseContrastOverview/BaseContrastOverview';
import { FullBaseTest } from './FullBaseTest/FullBaseTest';

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

const Row = (
  title: string,
  colors: ColorInfoType[],
  whiteText: boolean = false,
) => {
  return (
    <div className={cl(whiteText && classes.whiteText)}>
      <Heading
        size='xs'
        className={classes.mainTitle}
      >
        {title}
      </Heading>
      <div className={classes.row}>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[0].hex }}
        >
          <Heading
            size='2xs'
            className={classes.title}
          >
            Background default
          </Heading>
          {Box('Border subtle', colors[5].hex, colors[0].hex)}
          {Box('Border default', colors[6].hex, colors[0].hex)}
          {Box('Border strong', colors[7].hex, colors[0].hex)}
          {Box('Text subtle', colors[11].hex, colors[0].hex)}
          {Box('Text default', colors[12].hex, colors[0].hex)}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[1].hex }}
        >
          <Heading
            size='2xs'
            className={classes.title}
          >
            Background subtle
          </Heading>
          {Box('Border subtle', colors[5].hex, colors[1].hex)}
          {Box('Border default', colors[6].hex, colors[1].hex)}
          {Box('Border strong', colors[7].hex, colors[1].hex)}
          {Box('Text subtle', colors[11].hex, colors[1].hex)}
          {Box('Text default', colors[12].hex, colors[1].hex)}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[2].hex }}
        >
          <Heading
            size='2xs'
            className={classes.title}
          >
            Surface default
          </Heading>
          {Box('Border subtle', colors[5].hex, colors[2].hex)}
          {Box('Border default', colors[6].hex, colors[2].hex)}
          {Box('Border strong', colors[7].hex, colors[2].hex)}
          {Box('Text subtle', colors[11].hex, colors[2].hex)}
          {Box('Text default', colors[12].hex, colors[2].hex)}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[3].hex }}
        >
          <Heading
            size='2xs'
            className={classes.title}
          >
            Surface hover
          </Heading>
          {Box('Border subtle', colors[5].hex, colors[3].hex)}
          {Box('Border default', colors[6].hex, colors[3].hex)}
          {Box('Border strong', colors[7].hex, colors[3].hex)}
          {Box('Text subtle', colors[11].hex, colors[3].hex)}
          {Box('Text default', colors[12].hex, colors[3].hex)}
        </div>
        <div
          className={classes.column}
          style={{ backgroundColor: colors[4].hex }}
        >
          <Heading
            size='2xs'
            className={classes.title}
          >
            Surface active
          </Heading>
          {Box('Border subtle', colors[5].hex, colors[4].hex)}
          {Box('Border default', colors[6].hex, colors[4].hex)}
          {Box('Border strong', colors[7].hex, colors[4].hex)}
          {Box('Text subtle', colors[11].hex, colors[4].hex)}
          {Box('Text default', colors[12].hex, colors[4].hex)}
        </div>
      </div>
    </div>
  );
};

export default function Dev() {
  const theme1 = generateThemeForColor('#0062BA');
  const theme2 = generateThemeForColor('#1E98F5');
  const theme3 = generateThemeForColor('#E5AA20');
  const theme4 = generateThemeForColor('#f3e02e');
  const theme5 = generateThemeForColor('#DE251B');
  const theme6 = generateThemeForColor('#F45F63');
  const theme7 = generateThemeForColor('#054449');
  const theme8 = generateThemeForColor('#7befb2');
  const theme9 = generateThemeForColor('#410464');
  const theme10 = generateThemeForColor('#A845E1');
  const theme11 = generateThemeForColor('#109E96');
  const theme12 = generateThemeForColor('#243142');

  const themeGlobalBlue = generateThemeForColor(Settings.blueBaseColor);
  const themeGlobalGreen = generateThemeForColor(Settings.greenBaseColor);
  const themeGlobalOrange = generateThemeForColor(Settings.orangeBaseColor);
  const themeGlobalRed = generateThemeForColor(Settings.redBaseColor);
  const themeGlobalPurple = generateThemeForColor(Settings.purpleBaseColor);
  const themeGlobalYellow = generateThemeForColor(Settings.yellowBaseColor);

  return (
    <div className={classes.page}>
      <Header />
      <Container>
        <Heading
          size='lg'
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
          size='md'
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
          size='md'
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
          size='md'
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
          size='md'
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
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme1,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme2,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme3,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme4,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme5,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme6,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme7,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme8,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme9,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme10,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
              theme: theme11,
            },
            {
              title: 'Base: ' + theme1.light[8].hex,
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
          size='md'
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
        <Heading
          className={classes.sectionTitle}
          size='md'
        >
          Overgangen fra svart til hvit kontrastfarge på ulike Base farger
        </Heading>
        <BaseContrastOverview />
        <Heading
          className={classes.sectionTitle}
          size='md'
        >
          Viser blå base farger i et spekter av lightness verdier og om
          kontrastfargen er hvit eller svart per mode
        </Heading>
        <FullBaseTest />
      </Container>
    </div>
  );
}
