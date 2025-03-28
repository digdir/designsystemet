import { generateColorSchemes } from '@digdir/designsystemet';
import { Button, Heading } from '@digdir/designsystemet-react';
import type { CssColor } from '@digdir/designsystemet/color';
import { PlusIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { type ColorTheme, useThemeStore } from '../../../store';
import { ColorInput } from '../../ColorInput/ColorInput';
import { ColorPane } from '../ColorPane/ColorPane';
import classes from './ColorPage.module.css';

export const ColorPage = () => {
  type Pages = 'add-color' | 'edit-color' | 'none';
  type ColorType = 'main' | 'neutral' | 'support';

  const removeColor = useThemeStore((state) => state.removeColor);
  const addColor = useThemeStore((state) => state.addColor);
  const updateColor = useThemeStore((state) => state.updateColor);
  const colors = useThemeStore((state) => state.colors);
  const [activePanel, setActivePanel] = useState<Pages>('none');
  const [color, setColor] = useColor('#0062ba');
  const [name, setName] = useState('');
  const [index, setIndex] = useState(0);
  const [colorType, setColorType] = useState<ColorType>('main');
  const [initialColor, setInitialColor] = useState('#0062ba');
  const [initialName, setInitialName] = useState(name);

  const updateExistingColor = (color: string, name: string, index: number) => {
    updateColor(
      { name, colors: generateColorSchemes(color as CssColor) },
      index,
      colorType,
    );
  };

  const setupEditState = (
    colorTheme: ColorTheme,
    index: number,
    colorType: ColorType,
  ) => {
    setActivePanel('edit-color');
    setColor(ColorService.convert('hex', colorTheme.colors.light[11].hex));
    setName(colorTheme.name);
    setIndex(index);
    setColorType(colorType);
    setInitialColor(colorTheme.colors.light[11].hex);
    setInitialName(colorTheme.name);
  };

  const resetColorState = () => {
    setColor(ColorService.convert('hex', '#0062ba'));
    setName('');
    setActivePanel('none');
  };

  const setupNewColorState = (colorType: ColorType) => {
    const newColorName = colorType + '-color-' + colors[colorType].length;
    setActivePanel('add-color');
    setIndex(colors[colorType].length);
    setColorType(colorType);
    setColor(ColorService.convert('hex', '#0062ba'));
    setName(newColorName);
    addColor(
      {
        name: newColorName,
        colors: generateColorSchemes('#0062ba'),
      },
      colorType,
    );
  };

  return (
    <div>
      {/* MAIN COLORS */}
      {activePanel === 'none' && (
        <>
          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs'>Main</Heading>
              {colors.main.length < 40 && (
                <Button
                  variant='tertiary'
                  data-size='sm'
                  className={classes.AddBtn}
                  onClick={() => setupNewColorState('main')}
                  aria-label='Legg til hovedfarge'
                >
                  Legg til farge
                  <PlusIcon aria-hidden fontSize='1.5rem' />
                </Button>
              )}
              {colors.main.length >= 40 && (
                <div className={classes.error}>Maks 4 hovedfarger</div>
              )}
            </div>
            <div className={classes.colors}>
              {colors.main.map((colorTheme, index) => (
                <ColorInput
                  key={index}
                  color={colorTheme.colors.light[11].hex}
                  name={colorTheme.name}
                  onClick={() => setupEditState(colorTheme, index, 'main')}
                />
              ))}
            </div>
          </div>
          <div className={classes.separator}></div>
          <div className={classes.group}>
            <div className={classes.colors}>
              {colors.neutral.map((colorTheme, index) => (
                <ColorInput
                  key={index}
                  color={colorTheme.colors.light[11].hex}
                  name={colorTheme.name}
                  onClick={() => setupEditState(colorTheme, index, 'neutral')}
                />
              ))}
            </div>
          </div>

          {/* SUPPORT COLORS */}
          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs'>Support</Heading>
              {colors.support.length < 40 && (
                <Button
                  variant='tertiary'
                  data-size='sm'
                  className={classes.AddBtn}
                  onClick={() => setupNewColorState('support')}
                  aria-label='Legg til støttefarge'
                >
                  Legg til farge
                  <PlusIcon aria-hidden fontSize='1.5rem' />
                </Button>
              )}
              {colors.support.length >= 40 && (
                <div className={classes.error}>Maks 4 støttefarger</div>
              )}
            </div>
            <div className={classes.colors}>
              {colors.support.map((colorTheme, index) => (
                <ColorInput
                  key={index}
                  color={colorTheme.colors.light[11].hex}
                  name={colorTheme.name}
                  onClick={() => setupEditState(colorTheme, index, 'support')}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {(activePanel === 'add-color' || activePanel === 'edit-color') && (
        <ColorPane
          onClose={() => {
            resetColorState();
          }}
          onRemove={() => {
            removeColor(index, colorType);
            resetColorState();
          }}
          onCancel={() => {
            resetColorState();
            updateExistingColor(initialColor, initialName, index);
          }}
          type={activePanel}
          color={color}
          name={name}
          setColor={(color) => {
            setColor(color);
            updateExistingColor(color.hex, name, index);
          }}
          setName={(name) => {
            setName(name);
            updateExistingColor(color.hex, name, index);
          }}
          colorType={colorType}
        />
      )}
    </div>
  );
};
