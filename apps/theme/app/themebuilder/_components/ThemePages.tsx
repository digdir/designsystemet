'use client';

import {
  type ColorInfo,
  type ColorNumber,
  getColorNameFromNumber,
} from '@digdir/designsystemet';
import cl from 'clsx/lite';
import { useEffect, useRef } from 'react';
import { ColorContrasts, ColorPreview, ColorTokens } from '../../../components';
import { Colors } from '../../../components/Colors/Colors';
import { OverviewComponents } from '../../../components/OverviewComponents/OverviewComponents';
import { useThemeStore } from '../../../store';
import classes from './ThemePages.module.css';

export const ThemePages = () => {
  const colors = useThemeStore((state) => state.colors);
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);
  const themeTab = useThemeStore((state) => state.themeTab);
  const appearance = useThemeStore((state) => state.appearance);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // we need to set these properties on the preview element because they are immutable on :root
    for (const key in borderRadiuses) {
      const borderRadius = borderRadiuses[key as keyof typeof borderRadiuses];

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          borderRadius.variable,
          borderRadius.value,
        );
      }
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        '--ds-border-radius-base',
        `${baseBorderRadius / 16}rem`,
      );
    }
  }, [baseBorderRadius]);

  const getDsVars = (colors: {
    light: ColorInfo[];
    dark: ColorInfo[];
  }) => {
    const style = {} as Record<string, string>;

    let lightColors = colors.light;

    if (appearance === 'dark') {
      lightColors = colors.dark;
    }

    for (let i = 0; i < lightColors.length; i++) {
      const number = (i + 1) as ColorNumber;
      style[
        `--ds-color-neutral-${getColorNameFromNumber(number)
          .replace(/\s+/g, '-')
          .toLowerCase()}`
      ] = lightColors[i].hex;
    }

    return style;
  };

  const getDsMainVars = (colors: {
    light: ColorInfo[];
    dark: ColorInfo[];
  }) => {
    const style = {} as Record<string, string>;

    let lightColors = colors.light;

    if (appearance === 'dark') {
      lightColors = colors.dark;
    }

    for (let i = 0; i < lightColors.length; i++) {
      const number = (i + 1) as ColorNumber;
      style[
        `--ds-color-${getColorNameFromNumber(number)
          .replace(/\s+/g, '-')
          .toLowerCase()}`
      ] = lightColors[i].hex;
    }

    return style;
  };

  const style = () => {
    if (!colors) return {};

    const vars = {} as Record<string, string>;

    /* neutral */
    Object.assign(vars, getDsVars(colors.neutral[0].colors));
    /* get -ds-color-* vars */
    Object.assign(vars, getDsMainVars(colors.main[0].colors));

    return vars;
  };

  return (
    <>
      <div
        className={classes.panel}
        data-color-scheme={appearance}
        hidden={!(themeTab === 'overview')}
        style={style()}
      >
        <OverviewComponents ref={containerRef} />
      </div>

      <>
        <div
          className={cl(classes.panel, classes.colorsContainer)}
          data-color-scheme={appearance}
          hidden={!(themeTab === 'colorsystem')}
        >
          <Colors />
        </div>

        <div
          className={classes.panel}
          data-color-scheme={appearance}
          hidden={!(themeTab === 'colorsystem')}
        >
          <ColorPreview />
        </div>
        <div
          className={classes.panel}
          data-color-scheme={appearance}
          hidden={!(themeTab === 'colorsystem')}
        >
          <ColorTokens />
        </div>

        <div
          className={classes.panel}
          data-color-scheme={appearance}
          hidden={!(themeTab === 'colorsystem')}
        >
          <ColorContrasts />
        </div>
      </>
    </>
  );
};

// TODO get this token data from @digdir/designsystemet (use json from --preview or something)
const borderRadiuses = {
  sm: {
    name: 'sm',
    value:
      'min(var(--ds-border-radius-base)*0.5,var(--ds-border-radius-scale))',
    variable: '--ds-border-radius-sm',
  },
  md: {
    name: 'md',
    value: 'min(var(--ds-border-radius-base),var(--ds-border-radius-scale)*2)',
    variable: '--ds-border-radius-md',
  },
  lg: {
    name: 'lg',
    value:
      'min(var(--ds-border-radius-base)*2,var(--ds-border-radius-scale)*5)',
    variable: '--ds-border-radius-lg',
  },
  xl: {
    name: 'xl',
    value:
      'min(var(--ds-border-radius-base)*3,var(--ds-border-radius-scale)*7)',
    variable: '--ds-border-radius-xl',
  },
  default: {
    name: 'default',
    value: 'var(--ds-border-radius-base)',
    variable: '--ds-border-radius-default',
  },
  full: {
    name: 'full',
    value: '624.9375rem',
    variable: '--ds-border-radius-full',
  },
};
