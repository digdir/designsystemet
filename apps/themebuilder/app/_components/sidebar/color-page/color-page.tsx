import { generateColorSchemes } from '@digdir/designsystemet';
import { Button, Heading } from '@digdir/designsystemet-react';
import type { CssColor } from '@digdir/designsystemet/color';
import { PlusIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/useThemebuilder';
import { type ColorTheme, useThemeStore } from '~/store';
import { ColorInput } from '../../color-input/color-input';
import { ColorPane } from '../color-pane/color-pane';
import classes from './color-page.module.css';

type Pages = 'add-color' | 'edit-color' | 'none';
type ColorType = 'main' | 'neutral' | 'support';

export const ColorPage = () => {
  const { t } = useTranslation();

  const removeColor = useThemeStore((state) => state.removeColor);
  const addColor = useThemeStore((state) => state.addColor);
  const updateColor = useThemeStore((state) => state.updateColor);
  const { colors } = useThemebuilder();

  const [activePanel, setActivePanel] = useState<Pages>('none');
  const [color, setColor] = useColor('#0062ba');
  const [name, setName] = useState('');
  const [index, setIndex] = useState(0);
  const [colorType, setColorType] = useState<ColorType>('main');
  const [initialColor, setInitialColor] = useState('#0062ba');
  const [initialName, setInitialName] = useState('');

  const updateExistingColor = (color: string, name: string, index: number) => {
    if (index >= 0 && color && name) {
      const colorSchemes = generateColorSchemes(color as CssColor);
      updateColor({ name, colors: colorSchemes }, index, colorType);
    }
  };

  const setupEditState = (
    colorTheme: ColorTheme,
    index: number,
    colorType: ColorType,
  ) => {
    const hexColor = colorTheme.colors.light[11].hex;
    setActivePanel('edit-color');
    setColor(ColorService.convert('hex', hexColor));
    setName(colorTheme.name);
    setIndex(index);
    setColorType(colorType);
    setInitialColor(hexColor);
    setInitialName(colorTheme.name);
  };

  const resetColorState = () => {
    setColor(ColorService.convert('hex', '#0062ba'));
    setName('');
    setActivePanel('none');
  };

  const setupNewColorState = (colorType: ColorType) => {
    const colorCount = colors[colorType].length;
    const newColorName = `${colorType}-color-${colorCount + 1}`;
    const defaultHex = '#0062ba';
    const colorSchemes = generateColorSchemes(defaultHex);

    setActivePanel('add-color');
    setIndex(colorCount);
    setColorType(colorType);
    setColor(ColorService.convert('hex', defaultHex));
    setName(newColorName);

    addColor({ name: newColorName, colors: colorSchemes }, colorType);
  };

  return (
    <div>
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
                  aria-label={`${t('colorPane.add')} ${t('colorPane.main-color')}`}
                >
                  {t('colorPane.add')} {t('themeModal.color')}
                  <PlusIcon aria-hidden fontSize='1.5rem' />
                </Button>
              )}{' '}
              {colors.main.length >= 40 && (
                <div className={classes.error}>Maximum 4 main colours</div>
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

          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs'>Support</Heading>
              {colors.support.length < 40 && (
                <Button
                  variant='tertiary'
                  data-size='sm'
                  className={classes.AddBtn}
                  onClick={() => setupNewColorState('support')}
                  aria-label={`${t('colorPane.add')} ${t('colorPane.support-color')}`}
                >
                  {t('colorPane.add')} {t('themeModal.color')}
                  <PlusIcon aria-hidden fontSize='1.5rem' />
                </Button>
              )}{' '}
              {colors.support.length >= 40 && (
                <div className={classes.error}>Maximum 4 support colours</div>
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
