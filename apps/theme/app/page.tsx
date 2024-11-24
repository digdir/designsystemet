'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import type {
  ColorInfo,
  ColorMode,
  ContrastMode,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import {
  areColorsContrasting,
  canTextBeUsedOnColors,
  isHexColor,
} from '@digdir/designsystemet/color';
import { BookIcon, PaletteIcon } from '@navikt/aksel-icons';
import { ColorModal, Container } from '@repo/components';
import NextLink from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Settings } from '../settings';
import { useThemeStore } from '../store';

import type { ThemeColors } from '../types';

import { Previews } from '../components';
import classes from './page.module.css';

export default function Home() {
  const selectedColor = useThemeStore((state) => state.selectedColor);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const colorModalRef = useRef<HTMLDialogElement>(null);

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
  }, []);

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
  const getQueryColor = (colorType: ThemeColors, returnColor: CssColor) => {
    const queryColor = params.get(colorType);
    if (queryColor && isHexColor(queryColor.substring(1))) {
      return queryColor as CssColor;
    }
    return returnColor;
  };

  /**
   * Set the color in the query params
   *
   * @param colorType The type of color to set
   * @param color The color to set
   */
  const colorQuerySetter = (colorType: ThemeColors, color: CssColor) => {
    const defaultColor = {
      accent: Settings.accentBaseColor,
      neutral: Settings.neutralBaseColor,
      brand1: Settings.brand1BaseColor,
      brand2: Settings.brand2BaseColor,
      brand3: Settings.brand3BaseColor,
    };

    if (color !== defaultColor[colorType]) {
      params.set(colorType, color);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  /**
   * Set the query params
   *
   * TODO: Add support for setting colors
   */
  const setQueryParams = ({
    theme,
    borderRadius,
    contrastMode,
  }: {
    colors?: ThemeInfo;
    theme?: ColorMode;
    borderRadius?: string;
    contrastMode?: ContrastMode;
  }) => {
    theme && params.set('theme', theme);
    typeof borderRadius === 'string' &&
      params.set('borderRadius', borderRadius);
    contrastMode && params.set('contrastMode', contrastMode);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /* get theme from query on initial load */
  useEffect(() => {
    const borderRadius = params.get('borderRadius') as string;
    if (typeof borderRadius === 'string') {
    }
  }, []);

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
    }
    if (contrast && !textCanBeUsed) {
      return 'interaction';
    }

    return 'none';
  };

  return (
    <div>
      <ColorModal
        weight={selectedColor.color.number}
        hex={selectedColor.color.hex}
        namespace={'d'}
        colorModalRef={colorModalRef}
      />

      <main className={classes.main}>
        <Container>
          <div className={classes.header}>
            <Paragraph data-size='lg'>Designsystemet sin Temabygger</Paragraph>
            <Heading data-size='xl' className={classes.heading}>
              Sett i gang med å bygge ditt
              <span className={classes.headerText}> eget tema</span>
            </Heading>
            <Paragraph data-size='md' variant='long' className={classes.desc}>
              Far compensation times than my client our too it a now, hero's
              been rationale perfecting which towards absolutely fellow at on
              variety
            </Paragraph>
            <div className={classes.btnGroup}>
              <Button data-color='neutral' asChild>
                <NextLink href='/themebuilder'>
                  <PaletteIcon title='a11y-title' fontSize='1.5rem' />
                  Bygg tema
                </NextLink>
              </Button>
              <Button data-color='neutral' variant='secondary'>
                <BookIcon title='a11y-title' fontSize='1.5rem' />
                Dokumentasjon
              </Button>
            </div>
          </div>
          <Previews />
        </Container>
      </main>
    </div>
  );
}
