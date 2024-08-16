import { ColorPicker } from '../ColorPicker/ColorPicker';

export const ColorPickers = () => {
  return (
    <div>
      <ColorPicker
        color={themes['theme'].accent.light?.[9] as CssColor}
        title='Accent'
        onColorChanged={(color: CssColor) => {
          const theme = generateThemeForColor(color);
          const numberTheme = Tomato(theme);
          setThemes({
            ...themes,
            [test || 'theme']: {
              ...themes[test || 'theme'],
              accent: numberTheme,
            },
          });
        }}
      />
      <ColorPicker
        color={themes[test || 'theme'].neutral.light?.[9] as CssColor}
        title='Neutral'
        onColorChanged={(color: CssColor) => {
          const theme = generateThemeForColor(color);
          const numberTheme = Tomato(theme);
          setThemes({
            ...themes,
            [test || 'theme']: {
              ...themes[test || 'theme'],
              brand3: numberTheme,
            },
          });
        }}
      />
      <ColorPicker
        color={themes[test || 'theme'].brand1.light?.[9] as CssColor}
        title='Brand 1'
        onColorChanged={(color: CssColor) => {
          const theme = generateThemeForColor(color);
          const numberTheme = Tomato(theme);
          setThemes({
            ...themes,
            [test || 'theme']: {
              ...themes[test || 'theme'],
              brand1: numberTheme,
            },
          });
        }}
      />
      <ColorPicker
        color={themes[test || 'theme'].brand2.light?.[9] as CssColor}
        title='Brand 2'
        onColorChanged={(color: CssColor) => {
          const theme = generateThemeForColor(color);
          const numberTheme = Tomato(theme);
          setThemes({
            ...themes,
            [test || 'theme']: {
              ...themes[test || 'theme'],
              brand2: numberTheme,
            },
          });
        }}
      />
      <ColorPicker
        color={themes[test || 'theme'].brand3.light?.[9] as CssColor}
        title='Brand 3'
        onColorChanged={(color: CssColor) => {
          const theme = generateThemeForColor(color);
          const numberTheme = Tomato(theme);
          setThemes({
            ...themes,
            [test || 'theme']: {
              ...themes[test || 'theme'],
              brand3: numberTheme,
            },
          });
        }}
      />
    </div>
  );
};
