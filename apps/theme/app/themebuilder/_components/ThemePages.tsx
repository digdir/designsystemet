'use client';
import { useEffect, useRef } from 'react';
import { ColorContrasts, ColorPreview, ColorTokens } from '../../../components';
import { ColorDetail } from '../../../components/ColorDetail/ColorDetail';
import { Colors } from '../../../components/Colors/Colors';
import { ContrastRules } from '../../../components/ContrastRules/ContrastRules';
import { OverviewComponents } from '../../../components/OverviewComponents/OverviewComponents';
import { useThemeStore } from '../../../store';
import {
  generateColorVars,
  generateNeutralColorVars,
} from '../../../utils/generateColorVars';
import classes from './ThemePages.module.css';

export const ThemePages = () => {
  const colors = useThemeStore((state) => state.colors);
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);
  const themeTab = useThemeStore((state) => state.themeTab);
  const colorScheme = useThemeStore((state) => state.colorScheme);

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

  const style = () => {
    if (!colors) return {};

    const vars = {} as Record<string, string>;

    /* neutral */
    Object.assign(
      vars,
      generateNeutralColorVars(colors.neutral[0].colors, colorScheme),
    );
    /* get -ds-color-* vars */
    Object.assign(vars, generateColorVars(colors.main[0].colors, colorScheme));

    return vars;
  };

  return (
    <>
      <div
        className={classes.basicPanel}
        data-color-scheme={colorScheme}
        hidden={!(themeTab === 'overview')}
        style={style()}
      >
        <OverviewComponents ref={containerRef} />
      </div>
      <div hidden={!(themeTab === 'colorsystem')}>
        <Colors />
      </div>
      <>
        <div hidden={!(themeTab === 'colorsystem')}>
          <ColorPreview />
        </div>
        <div hidden={!(themeTab === 'colorsystem')}>
          <ColorTokens />
        </div>

        <div hidden={!(themeTab === 'colorsystem')}>
          <ColorDetail />
        </div>

        <div hidden={!(themeTab === 'contrast')}>
          <ContrastRules />
        </div>

        <div
          className={classes.panel}
          data-color-scheme={colorScheme}
          hidden={!(themeTab === 'contrast')}
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
