import { useState } from 'react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { generateThemeForColor } from '@digdir/designsystemet/color';
import { Button } from '@digdir/designsystemet-react';

import { ColorPicker } from '@ui/components/ColorPicker/ColorPicker';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';

import { getDummyTheme } from '../../../common/dummyTheme';
import { themeToFigmaFormat } from '../../../common/utils';
import { useThemeStore, type ColorTheme } from '../../../common/store';

import classes from './AddTheme.module.css';

function AddTheme() {
  const [theme, setTheme] = useState<ColorTheme>(getDummyTheme());
  const setLoading = useThemeStore((state) => state.setLoading);
  const [name, setName] = useState<string>('');

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'addTheme',
            addTheme: {
              theme,
              name,
            },
          },
        },
        '*',
      );
    }, 500);
  };

  return (
    <div className={classes.page}>
      <Breadcrumbs
        text='Legg til nytt tema'
        url={'/themes'}
      />
      <div>
        <input
          className={classes.input}
          type='text'
          placeholder='Navn'
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={classes.pickers}>
        <ColorPicker
          color={theme.accent.light?.[9] as CssColor}
          title='Accent'
          onColorChanged={(color: CssColor) => {
            setTheme({
              ...theme,
              accent: themeToFigmaFormat(generateThemeForColor(color)),
            });
          }}
        />
        <ColorPicker
          color={theme.neutral.light?.[9] as CssColor}
          title='Neutral'
          onColorChanged={(color: CssColor) => {
            setTheme({
              ...theme,
              neutral: themeToFigmaFormat(generateThemeForColor(color)),
            });
          }}
        />
        <ColorPicker
          color={theme.brand1.light?.[9] as CssColor}
          title='Brand 1'
          onColorChanged={(color: CssColor) => {
            setTheme({
              ...theme,
              brand1: themeToFigmaFormat(generateThemeForColor(color)),
            });
          }}
        />
        <ColorPicker
          color={theme.brand2.light?.[9] as CssColor}
          title='Brand 2'
          onColorChanged={(color: CssColor) => {
            setTheme({
              ...theme,
              brand2: themeToFigmaFormat(generateThemeForColor(color)),
            });
          }}
        />
        <ColorPicker
          color={theme.brand3.light?.[9] as CssColor}
          title='Brand 3'
          onColorChanged={(color: CssColor) => {
            setTheme({
              ...theme,
              brand3: themeToFigmaFormat(generateThemeForColor(color)),
            });
          }}
        />
      </div>
      <Button
        size='sm'
        className='btn'
        onClick={() => handleClick()}
      >
        Legg til
      </Button>
    </div>
  );
}

export default AddTheme;
