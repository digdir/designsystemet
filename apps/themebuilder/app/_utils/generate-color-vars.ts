import {
  type ColorScheme,
  type CssColor,
  generateColorSchemes,
  type ThemeInfo,
} from '@digdir/designsystemet';

export const generateColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
  prefix?: string,
) => {
  const style = {} as Record<string, string>;

  for (const color of colors[colorScheme]) {
    style[`--ds-color-${prefix ? `${prefix}-` : ''}${color.name}`] = color.hex;
  }

  return style;
};

/** Generates a record with `--ds` CSS variables for the provided color inteded to be used with `style` property */
export const styleColorVars = (
  color: CssColor,
  colorScheme: ColorScheme,
  /** Optional prefix for the CSS variable name. `--ds-color-<prefix>-<color.name>`*/
  prefix?: string,
) => {
  if (!color) return {};

  const vars = {} as Record<string, string>;

  Object.assign(
    vars,
    generateColorVars(generateColorSchemes(color), colorScheme, prefix || ''),
  );

  return vars;
};
