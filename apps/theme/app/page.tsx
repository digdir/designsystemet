/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Heading } from '@digdir/designsystemet-react';
import type {
  ColorError,
  ColorInfo,
  ColorType,
  ContrastMode,
  Mode,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import {
  canTextBeUsedOnColors,
  generateColorTheme,
  generateThemeForColor,
  areColorsContrasting,
  isHexColor,
} from '@digdir/designsystemet/color';

import { useThemeStore } from '../store';
import { mapTokens } from '../utils/tokenMapping';
import {
  Container,
  Header,
  ColorModal,
  Previews,
  Scales,
  ThemeToolbar,
} from '../components';
import { Settings } from '../settings';

import classes from './page.module.css';

export default function Home() {
  const accentTheme = useThemeStore((state) => state.accentTheme);
  const neutralTheme = useThemeStore((state) => state.neutralTheme);
  const brandOneTheme = useThemeStore((state) => state.brandOneTheme);
  const brandTwoTheme = useThemeStore((state) => state.brandTwoTheme);
  const brandThreeTheme = useThemeStore((state) => state.brandThreeTheme);
  const setAccentTheme = useThemeStore((state) => state.setAccentTheme);
  const setNeutralTheme = useThemeStore((state) => state.setNeutralTheme);
  const setBrandOneTheme = useThemeStore((state) => state.setBrandOneTheme);
  const setBrandTwoTheme = useThemeStore((state) => state.setBrandTwoTheme);
  const setBrandThreeTheme = useThemeStore((state) => state.setBrandThreeTheme);

  const selectedColor = useThemeStore((state) => state.selectedColor);

  const [accentError, setAccentError] = useState<ColorError>('none');
  const [neutralError, setNeutralError] = useState<ColorError>('none');
  const [brandOneError, setBrandOneError] = useState<ColorError>('none');
  const [brandTwoError, setBrandTwoError] = useState<ColorError>('none');
  const [brandThreeError, setBrandThreeError] = useState<ColorError>('none');

  const [themeMode, setThemeMode] = useState<Mode>('light');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('aa');

  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const colorModalRef = useRef<HTMLDialogElement>(null);

  /* get theme from query on initial load */
  useEffect(() => {
    const theme = params.get('theme') as Mode;
    if (theme) {
      setThemeMode(theme);
    }
  }, []);

  useEffect(() => {
    mapTokens();

    // Get colors from query params or use default colors
    const queryAccent = getQueryColor('accent', accentTheme.color);
    const queryNeutral = getQueryColor('neutral', neutralTheme.color);
    const queryBrand1 = getQueryColor('brand1', brandOneTheme.color);
    const queryBrand2 = getQueryColor('brand2', brandTwoTheme.color);
    const queryBrand3 = getQueryColor('brand3', brandThreeTheme.color);

    // Generate color scales
    const colors = generateColorTheme({
      colors: {
        accent: queryAccent,
        neutral: queryNeutral,
        brand1: queryBrand1,
        brand2: queryBrand2,
        brand3: queryBrand3,
      },
      contrastMode,
    });

    // Update colors and themes
    updateColor('accent', queryAccent, colors.accent);
    updateColor('neutral', queryNeutral, colors.neutral);
    updateColor('brand1', queryBrand1, colors.brand1);
    updateColor('brand2', queryBrand2, colors.brand2);
    updateColor('brand3', queryBrand3, colors.brand3);
  }, [contrastMode]);

  useEffect(() => {
    // Open modal on selected color change
    useThemeStore.subscribe(
      (state) => state.selectedColor,
      () => {
        colorModalRef.current?.showModal();
      },
    );
    // Sticky Menu Area
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  /**
   * Check if the header should be sticky
   */
  const isSticky = () => {
    const header = document.querySelector('.pickers');
    const scrollTop = window.scrollY;
    if (header) {
      scrollTop >= 250
        ? header.classList.add('is-sticky')
        : header.classList.remove('is-sticky');
    }
  };

  /**
   * Get a color from the query params or return the default color
   *
   * @param colorType The type of color to get
   * @param returnColor The default color to return
   * @returns The color from the query or the default color
   */
  const getQueryColor = (colorType: ColorType, returnColor: CssColor) => {
    const queryColor = params.get(colorType);
    if (queryColor && isHexColor(queryColor.substring(1))) {
      return queryColor as CssColor;
    } else {
      return returnColor;
    }
  };

  /**
   *
   * Update all the states for a color
   *
   * @param type  The type of color to update
   * @param color The color to update
   * @param theme The theme to update
   */
  const updateColor = (type: ColorType, color: CssColor, theme: ThemeInfo) => {
    const colorErrorSetterMap = {
      accent: setAccentError,
      neutral: setNeutralError,
      brand1: setBrandOneError,
      brand2: setBrandTwoError,
      brand3: setBrandThreeError,
    };

    const themeColorSetterMap = {
      accent: setAccentTheme,
      neutral: setNeutralTheme,
      brand1: setBrandOneTheme,
      brand2: setBrandTwoTheme,
      brand3: setBrandThreeTheme,
    };

    themeColorSetterMap[type](theme, color);
    colorErrorSetterMap[type](getColorError(theme.light));
    colorQuerySetter(type, color);
  };

  /**
   * Set the color in the query params
   *
   * @param colorType The type of color to set
   * @param color The color to set
   */
  const colorQuerySetter = (colorType: ColorType, color: CssColor) => {
    const defaultColor = {
      accent: Settings.accentBaseColor,
      neutral: Settings.neutralBaseColor,
      brand1: Settings.brand1BaseColor,
      brand2: Settings.brand2BaseColor,
      brand3: Settings.brand3BaseColor,
    };

    if (color !== defaultColor[colorType]) {
      params.set(colorType, color);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const themeQuerySetter = (themeMode: Mode) => {
    params.set('theme', themeMode);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /**
   * Get the color error for a color
   *
   * @param scale The color scale to check
   * @returns The error type
   */
  const getColorError = (scale: ColorInfo[]) => {
    const contrast = areColorsContrasting(
      scale[8].hex,
      '#ffffff',
      'decorative',
    );
    const textCanBeUsed = canTextBeUsedOnColors(scale[8].hex, scale[10].hex);

    if (!contrast && textCanBeUsed) {
      return 'decorative';
    } else if (contrast && !textCanBeUsed) {
      return 'interaction';
    }

    return 'none';
  };

  return (
    <div>
      <Header />
      <ColorModal
        color={selectedColor}
        colorModalRef={colorModalRef}
      />

      <main className={classes.main}>
        <Container>
          <Heading
            size='md'
            className={classes.title}
          >
            Sett opp fargetema
          </Heading>
          <ThemeToolbar
            accentError={accentError}
            neutralError={neutralError}
            brand1Error={brandOneError}
            brand2Error={brandTwoError}
            brand3Error={brandThreeError}
            contrastMode={contrastMode}
            onColorChanged={(colorType, color) => {
              const theme = generateThemeForColor(color, contrastMode);
              updateColor(colorType, color, theme);
            }}
            onContrastModeChanged={(mode) => {
              setContrastMode(mode);
            }}
          />
          <Scales themeMode={themeMode} />

          <Previews
            themeMode={themeMode}
            onThemeModeChange={(themeMode: Mode) => {
              setThemeMode(themeMode);
              themeQuerySetter(themeMode);
            }}
          />
        </Container>
      </main>
    </div>
  );
}
