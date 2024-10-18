'use client';
import { Container } from '@repo/components';

import type { ThemeInfo } from '@digdir/designsystemet/color';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import classes from './page.module.css';

export default function Home() {
  const red1 = generateThemeForColor('#ff0000');
  const red2 = generateThemeForColor('#ff8282');
  const red3 = generateThemeForColor('#8c0000');
  const orange1 = generateThemeForColor('#ff6a00');
  const orange2 = generateThemeForColor('#ffb785');
  const orange3 = generateThemeForColor('#8a3800');
  const yellow1 = generateThemeForColor('#ffea00');
  const yellow2 = generateThemeForColor('#fff585');
  const yellow3 = generateThemeForColor('#918500');
  const green1 = generateThemeForColor('#00ff0d');
  const green2 = generateThemeForColor('#80ff86');
  const green3 = generateThemeForColor('#018f08');
  const cyan1 = generateThemeForColor('#00ffff');
  const cyan2 = generateThemeForColor('#7affff');
  const cyan3 = generateThemeForColor('#008f8f');
  const blue1 = generateThemeForColor('#0051ff');
  const blue2 = generateThemeForColor('#82aaff');
  const blue3 = generateThemeForColor('#002c8a');
  const purple1 = generateThemeForColor('#8400ff');
  const purple2 = generateThemeForColor('#c485ff');
  const purple3 = generateThemeForColor('#460087');

  const Column = ({ theme }: { theme: ThemeInfo }) => {
    return (
      <div className={classes.column}>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[1].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[2].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[3].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[4].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[5].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[6].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[7].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[11].hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: theme.light[12].hex }}
        ></div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <main>
        <Container>
          <h1 className={classes.title}>Balanse og harmoni mellom farger</h1>
          <p className={classes.ingress}>
            Vi genererer en del farger med faste lyshetsverdier (HSLuv) som ikke
            harmonerer så godt sammen. Dette er fordi enkelte farger er visuelt
            lysere enn andre farger. Gulfarger er et godt eksempel på dette.
          </p>
          <div className={classes.topLabels}>
            <div className={classes.topLabel}>RF</div>
            <div className={classes.topLabel}>RL</div>
            <div className={classes.topLabel}>RS</div>
            <div className={classes.topLabel}>OF</div>
            <div className={classes.topLabel}>OL</div>
            <div className={classes.topLabel}>OS</div>
            <div className={classes.topLabel}>YF</div>
            <div className={classes.topLabel}>YL</div>
            <div className={classes.topLabel}>YS</div>
            <div className={classes.topLabel}>GF</div>
            <div className={classes.topLabel}>GL</div>
            <div className={classes.topLabel}>GS</div>
            <div className={classes.topLabel}>CF</div>
            <div className={classes.topLabel}>CL</div>
            <div className={classes.topLabel}>CS</div>
            <div className={classes.topLabel}>BF</div>
            <div className={classes.topLabel}>BL</div>
            <div className={classes.topLabel}>BS</div>
            <div className={classes.topLabel}>PF</div>
            <div className={classes.topLabel}>PL</div>
            <div className={classes.topLabel}>PS</div>
          </div>
          <div className={classes.row}>
            <div>
              <div className={classes.label}>Background Subtle</div>
              <div className={classes.label}>Surface Default</div>
              <div className={classes.label}>Surface Hover</div>
              <div className={classes.label}>Surface Active</div>
              <div className={classes.label}>Border Subtle</div>
              <div className={classes.label}>Border Default</div>
              <div className={classes.label}>Border Strong</div>
              <div className={classes.label}>Text Subtle</div>
              <div className={classes.label}>Text Default</div>
            </div>
            <div className={classes.columns}>
              <Column theme={red1} />
              <Column theme={red2} />
              <Column theme={red3} />
              <Column theme={orange1} />
              <Column theme={orange2} />
              <Column theme={orange3} />
              <Column theme={yellow1} />
              <Column theme={yellow2} />
              <Column theme={yellow3} />
              <Column theme={green1} />
              <Column theme={green2} />
              <Column theme={green3} />
              <Column theme={cyan1} />
              <Column theme={cyan2} />
              <Column theme={cyan3} />
              <Column theme={blue1} />
              <Column theme={blue2} />
              <Column theme={blue3} />
              <Column theme={purple1} />
              <Column theme={purple2} />
              <Column theme={purple3} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
