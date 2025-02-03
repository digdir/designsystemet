import {
  type CssColor,
  type ThemeInfo,
  getContrastFromHex,
} from '@digdir/designsystemet/color';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import chroma from 'chroma-js';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { ColorInfo } from '../ColorInfo/ColorInfo';
import { ColorScale } from '../ColorScale/ColorScale';
import { ContrastChecker } from '../ContrastChecker/ContrastChecker';
import {
  type LuminanceType,
  type ThemeSettingsType,
  useDebugStore,
} from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import { ColorIndexes } from '../utils';
import classes from './FrontPage.module.css';

const generateBaseThemes = (
  luminance: LuminanceType,
  themeSettings: ThemeSettingsType,
) => {
  const themes = [];
  for (let i = 0; i < 100; i++) {
    const color = chroma('#0062BA')
      .luminance((i + 1) / 100)
      .hex() as CssColor;
    themes.push(generateColorSchemes(color, luminance, themeSettings));
  }
  return themes;
};

export const FrontPage = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const theme = useDebugStore((state) => state.colorScale);
  const [baseThemes, setBaseThemes] = useState<ThemeInfo[]>(
    generateBaseThemes(luminance, useDebugStore.getState().themeSettings),
  );
  const themeSettings = useDebugStore((state) => state.themeSettings);

  useEffect(() => {
    setBaseThemes(generateBaseThemes(luminance, themeSettings));
  }, [themeSettings.base.modifier]);

  const testColorContrasts = (
    index1: number,
    index2: number,
    contrastLimit: number,
    mode: 'light' | 'dark',
  ) => {
    let passed = 0;
    for (let i = 0; i < baseThemes.length; i++) {
      const theme = baseThemes[i];
      const contrast = getContrastFromHex(
        theme[mode][index1].hex,
        theme[mode][index2].hex,
      );
      if (contrast >= contrastLimit) {
        passed++;
      } else {
      }
    }
    return passed;
  };

  type ContrastSectionProps = {
    title: string;
    desc: string;
    error: boolean;
  };

  const getTextDefaultTests = (mode: 'light' | 'dark') => {
    const tests = [
      ColorIndexes.backgroundDefault,
      ColorIndexes.backgroundTinted,
      ColorIndexes.surfaceDefault,
      ColorIndexes.surfaceTinted,
      ColorIndexes.surfaceHover,
      ColorIndexes.surfaceActive,
    ];

    return tests.reduce((passed, index) => {
      const contrast = getContrastFromHex(
        theme[mode][index].hex,
        theme[mode][ColorIndexes.textDefault].hex,
      );
      return passed + (contrast >= 4.5 ? 1 : 0);
    }, 0);
  };

  const getTextSubtleTests = (mode: 'light' | 'dark') => {
    const tests = [
      ColorIndexes.backgroundDefault,
      ColorIndexes.backgroundTinted,
      ColorIndexes.surfaceDefault,
      ColorIndexes.surfaceTinted,
    ];

    return tests.reduce((passed, index) => {
      const contrast = getContrastFromHex(
        theme[mode][index].hex,
        theme[mode][ColorIndexes.textSubtle].hex,
      );
      return passed + (contrast >= 4.5 ? 1 : 0);
    }, 0);
  };

  const getBorderDefaultTests = (mode: 'light' | 'dark') => {
    const tests = [
      ColorIndexes.backgroundDefault,
      ColorIndexes.backgroundTinted,
      ColorIndexes.surfaceDefault,
      ColorIndexes.surfaceTinted,
    ];

    return tests.reduce((passed, index) => {
      const contrast = getContrastFromHex(
        theme[mode][index].hex,
        theme[mode][ColorIndexes.borderDefault].hex,
      );
      return passed + (contrast >= 3 ? 1 : 0);
    }, 0);
  };

  const getBorderStrongTests = (mode: 'light' | 'dark') => {
    const tests = [
      ColorIndexes.backgroundDefault,
      ColorIndexes.backgroundTinted,
      ColorIndexes.surfaceDefault,
      ColorIndexes.surfaceTinted,
    ];

    return tests.reduce((passed, index) => {
      const contrast = getContrastFromHex(
        theme[mode][index].hex,
        theme[mode][ColorIndexes.borderStrong].hex,
      );
      return passed + (contrast >= 4.5 ? 1 : 0);
    }, 0);
  };

  const getContrastDefaultTests = (mode: 'light' | 'dark') => {
    let passed = 0;
    const test1 = testColorContrasts(
      ColorIndexes.baseDefault,
      ColorIndexes.baseContrastDefault,
      4.5,
      mode,
    );
    const test2 = testColorContrasts(
      ColorIndexes.baseHover,
      ColorIndexes.baseContrastDefault,
      4.5,
      mode,
    );
    const test3 = testColorContrasts(
      ColorIndexes.baseActive,
      ColorIndexes.baseContrastDefault,
      4.5,
      mode,
    );
    passed += test1 + test2 + test3;

    return passed;
  };

  const getContrastSubtleTests = (mode: 'light' | 'dark') => {
    let passed = 0;
    const test1 = testColorContrasts(
      ColorIndexes.baseDefault,
      ColorIndexes.baseContrastSubtle,
      4.5,
      mode,
    );
    passed += test1;

    return passed;
  };

  const ContrastSection = ({ title, desc, error }: ContrastSectionProps) => {
    return (
      <div className={classes.contrastTestsItem}>
        {error && (
          <div className={classes.sectionCircle}>
            <XMarkIcon title='a11y-title' fontSize='2.2rem' />
          </div>
        )}
        {!error && (
          <div className={cl(classes.sectionCircle, classes.passed)}>
            <CheckmarkIcon title='a11y-title' fontSize='2.2rem' />
          </div>
        )}
        <div className={classes.sectionTextContainer}>
          <div className={classes.sectionHeading}>{title}</div>
          <div className={classes.sectionDesc}>{desc}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <ColorScale />

      <div className={classes.panel}>
        <ColorInfo />
      </div>
      <div className={classes.panel}>
        <ContrastChecker />
      </div>

      <div className={classes.contrastTests}>
        <div className={classes.contrastTestsHeading}>Contrast tests</div>
        <div className={classes.contrastTestsItems}>
          <ContrastSection
            title='Text default'
            desc={getTextDefaultTests('light') + ' / 6 tests passed'}
            error={getTextDefaultTests('light') !== 6}
          />
          <ContrastSection
            title='Text subtle'
            desc={getTextSubtleTests('light') + ' / 4 tests passed'}
            error={getTextSubtleTests('light') !== 4}
          />
          <ContrastSection
            title='Border default'
            desc={getBorderDefaultTests('light') + ' / 4 tests passed'}
            error={getBorderDefaultTests('light') !== 4}
          />
          <ContrastSection
            title='Border strong'
            desc={getBorderStrongTests('light') + ' / 4 tests passed'}
            error={getBorderStrongTests('light') !== 4}
          />
          <ContrastSection
            title='Base contrast default'
            desc={getContrastDefaultTests('light') + ' / 300 tests passed'}
            error={getBorderStrongTests('light') !== 300}
          />
          <ContrastSection
            title='Base contrast subtle'
            desc={getContrastSubtleTests('light') + ' / 100 tests passed'}
            error={getContrastSubtleTests('light') !== 100}
          />
        </div>
      </div>
    </div>
  );
};
