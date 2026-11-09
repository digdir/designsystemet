import {
  type ColorSteps,
  generateColorSchemes,
  semanticColorNames,
  severityColors,
} from '@digdir/designsystemet/internal';
import { describe, expect, it } from 'vitest';
import { configThemeToUrl } from './config-to-url';
import { compactThemeColors, exportThemeColors } from './theme-colors';

const legacyTheme = {
  colors: { accent: '#123456', neutral: '#333333' },
  borderRadius: 8,
  overrides: {
    colors: {
      accent: { 'text-default': { dark: '#112233' } },
      danger: { 'border-default': { light: '#aa0000' } },
    },
    severity: { warning: '#ffaa00' },
    focus: { inner: { light: '#ff0000' } },
  },
};

const urlParams = (theme: Parameters<typeof configThemeToUrl>[0]) =>
  new URL(configThemeToUrl(theme), 'https://themebuilder.local').searchParams;

describe('theme colors', () => {
  it('exports base colors, with only the edited steps, and no deprecated overrides', () => {
    expect(exportThemeColors(legacyTheme)).toEqual({
      colors: {
        accent: {
          'text-default': { dark: '#112233' },
          'base-default': { light: '#123456' },
        },
        neutral: '#333333',
        warning: '#ffaa00',
        danger: {
          'border-default': { light: '#aa0000' },
          'base-default': { light: severityColors.danger },
        },
      },
      borderRadius: 8,
      overrides: { focus: { inner: { light: '#ff0000' } } },
    });
  });

  it('exports every step of a color with an edited base-default in light', () => {
    const exported = exportThemeColors({
      colors: { accent: '#123456', neutral: '#333333' },
      overrides: {
        colors: { accent: { 'base-default': { light: '#abcdef' } } },
      },
    });
    const generated = generateColorSchemes('#123456');
    expect(Object.keys(exported.colors.accent)).toEqual(semanticColorNames);
    expect(exported.colors.accent).toHaveProperty(
      'base-default.light',
      '#abcdef',
    );
    expect(exported.colors.accent).toHaveProperty(
      'base-hover.dark',
      generated.dark['base-hover'].hex,
    );
    expect(exported.colors.neutral).toBe('#333333');
  });

  it('compacts an exported theme back to base colors and only the edited steps', () => {
    expect(compactThemeColors(exportThemeColors(legacyTheme))).toEqual(
      legacyTheme,
    );
  });

  it('compacts colors written as their full scale', () => {
    const generated = generateColorSchemes('#123456');
    const accent = Object.fromEntries(
      semanticColorNames.map((step) => [
        step,
        { light: generated.light[step].hex, dark: generated.dark[step].hex },
      ]),
    );
    accent['text-default'] = { ...accent['text-default'], dark: '#112233' };
    expect(
      compactThemeColors({
        colors: { accent: accent as ColorSteps, neutral: '#333333' },
      }),
    ).toEqual({
      colors: { accent: '#123456', neutral: '#333333' },
      overrides: {
        colors: { accent: { 'text-default': { dark: '#112233' } } },
      },
    });
  });

  it('compacts colors written as some of their steps', () => {
    expect(
      compactThemeColors({
        colors: {
          accent: {
            'base-default': { light: '#123456' },
            'text-default': { dark: '#112233' },
          },
          neutral: '#333333',
          danger: { 'base-default': { light: '#ab1234' } },
        },
      }),
    ).toEqual({
      colors: { accent: '#123456', neutral: '#333333' },
      overrides: {
        colors: { accent: { 'text-default': { dark: '#112233' } } },
        severity: { danger: '#ab1234' },
      },
    });
  });

  it('keeps an edited base-default in light of a legacy config as an edit', () => {
    const theme = {
      colors: { accent: '#123456', neutral: '#333333' },
      overrides: {
        colors: { accent: { 'base-default': { light: '#abcdef' } } },
      },
    };
    expect(compactThemeColors(theme)).toEqual(theme);
  });

  it('reads color steps and severity colors into the editor params', () => {
    const params = urlParams({
      colors: {
        accent: {
          'base-default': { light: '#123456', dark: '#654321' },
          'text-default': { dark: '#112233' },
        },
        neutral: '#333333',
        danger: '#ab1234',
        info: severityColors.info,
      },
    });
    expect(params.get('colors')).toBe('accent:#123456 neutral:#333333');
    expect(params.get('severity')).toBe('danger:#ab1234');
    expect(params.get('color-overrides')).toBe(
      'accent|base-default|dark:#654321 accent|text-default|dark:#112233',
    );
  });

  it('reads legacy overrides on top of the color steps', () => {
    const params = urlParams({
      colors: {
        accent: {
          'base-default': { light: '#123456' },
          'text-default': { light: '#000001', dark: '#112233' },
        },
        neutral: '#333333',
      },
      overrides: {
        colors: { accent: { 'text-default': { dark: '#445566' } } },
        severity: { danger: '#ab1234' },
      },
    });
    expect(params.get('severity')).toBe('danger:#ab1234');
    expect(params.get('color-overrides')).toBe(
      'accent|text-default|light:#000001|dark:#445566',
    );
  });
});
