import type { CssColor } from '@adobe/leonardo-contrast-colors';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Heading } from '@digdir/designsystemet-react';
import type { ColorNumber } from '@digdir/designsystemet/color';
import {
  areColorsContrasting,
  getApcaContrastLc,
  getColorNameFromNumber,
} from '@digdir/designsystemet/color';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons';

import classes from '../ColorModal.module.css';

const ContrastItem = ({
  error,
  text,
  subText,
}: {
  text: string;
  error: boolean;
  subText: string;
}) => {
  return (
    <div className={classes.contrastItem}>
      {error ? (
        <ExclamationmarkTriangleFillIcon
          title='a11y-title'
          fontSize='1.3rem'
          className={classes.contrastError}
        />
      ) : (
        <CheckmarkCircleFillIcon title='a11y-title' fontSize='1.3rem' />
      )}
      {text} <span className={classes.contrastItemSubText}>{subText}</span>
    </div>
  );
};

const ContrastBox = ({
  title,
  selectedColor,
  contrastColor,
  colorNumber,
}: {
  title: string;
  selectedColor: string;
  contrastColor: CssColor;
  colorNumber: ColorNumber;
}) => {
  return (
    <div className={classes.contrastBox}>
      <Heading level={2} className={classes.contrastTitle}>
        {title}
      </Heading>
      <h3 className={classes.contrastSubTitle}>WCAG 2</h3>
      {colorNumber !== 12 && colorNumber !== 13 && (
        <div className={classes.contrastContainer}>
          <ContrastItem
            text='AA'
            subText='(3:1)'
            error={
              !areColorsContrasting(
                selectedColor as CssColor,
                contrastColor,
                'decorative',
              )
            }
          />
        </div>
      )}
      <div className={classes.contrastContainer}>
        <ContrastItem
          text='AA'
          subText='(4.5:1)'
          error={
            !areColorsContrasting(
              selectedColor as CssColor,
              contrastColor,
              'aa',
            )
          }
        />
      </div>
      <div className={classes.contrastContainer}>
        <ContrastItem
          text='AAA'
          subText='(7:1)'
          error={
            !areColorsContrasting(
              selectedColor as CssColor,
              contrastColor,
              'aaa',
            )
          }
        />
      </div>

      {(colorNumber === 12 || colorNumber === 13) && (
        <>
          <h3 className={classes.contrastSubTitle}>APCA</h3>
          <div className={classes.contrastContainer}>
            <ContrastItem
              text='Lc75'
              subText='(18px / 400)'
              error={
                (getApcaContrastLc(
                  selectedColor as CssColor,
                  contrastColor,
                ) as number) <= 75
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export const ContrastBoxes = ({
  weight,
  hex,
}: {
  weight: number;
  hex: string;
}) => {
  let contrastColors: ColorNumber[] = [];

  if (
    weight === 1 ||
    weight === 2 ||
    weight === 3 ||
    weight === 4 ||
    weight === 5
  ) {
    contrastColors = [6, 7, 8, 12, 13];
  } else if (
    weight === 6 ||
    weight === 7 ||
    weight === 8 ||
    weight === 9 ||
    weight === 10 ||
    weight === 11 ||
    weight === 12 ||
    weight === 13
  ) {
    contrastColors = [1, 2, 3, 4, 5];
  }
  return (
    <>
      {contrastColors.map((colorNumber) => (
        <ContrastBox
          key={colorNumber}
          colorNumber={weight as ColorNumber}
          title={getColorNameFromNumber(colorNumber)}
          selectedColor={hex}
          contrastColor={colorTheme[colorNumber - 1].hex}
        />
      ))}
    </>
  );
};
