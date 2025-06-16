import { Button, Heading } from '@digdir/designsystemet-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/useThemebuilder';
import type { ColorTheme } from '~/routes/themebuilder/_utils/useThemebuilder';
import { ColorInput } from '../../color-input/color-input';
import { ColorPane } from '../color-pane/color-pane';
import classes from './color-page.module.css';

type ColorEditorState = {
  activePanel: 'add-color' | 'edit-color' | 'none';
  colorType: 'main' | 'neutral' | 'support';
  index: number;
  name: string;
  initialName: string;
  initialHex: string;
};

const DEFAULT_COLOR = '#0062ba';

export const ColorPage = () => {
  const { t } = useTranslation();
  const { colors } = useThemebuilder();
  const [searchParams, setSearchParams] = useSearchParams();

  const [editorState, setEditorState] = useState<ColorEditorState>({
    activePanel: 'none',
    colorType: 'main',
    index: 0,
    name: '',
    initialName: '',
    initialHex: DEFAULT_COLOR,
  });

  const [color, setColor] = useColor(DEFAULT_COLOR);

  const updateColorInParams = (
    hex: string,
    name: string,
    type: string,
    index: number,
  ) => {
    if (index < 0 || !hex || !name) return;

    const updatedParams = new URLSearchParams(searchParams);

    if (type === 'main' || type === 'support') {
      const colorParam = searchParams.get(type) || '';
      const colorArray = colorParam.split(' ').filter(Boolean);

      if (index < colorArray.length) {
        colorArray[index] = `${name}:${hex}`;
      } else {
        colorArray.push(`${name}:${hex}`);
      }

      updatedParams.set(type, colorArray.join(' '));
    } else if (type === 'neutral') {
      updatedParams.set('neutral', hex);
    }

    setSearchParams(updatedParams, { replace: true });
  };

  const openColorEditor = (
    colorTheme: ColorTheme,
    index: number,
    type: 'main' | 'neutral' | 'support',
  ) => {
    const hexColor = colorTheme.colors.light[11].hex;

    setColor(ColorService.convert('hex', hexColor));

    setEditorState({
      activePanel: 'edit-color',
      colorType: type,
      index: index,
      name: colorTheme.name,
      initialName: colorTheme.name,
      initialHex: hexColor,
    });
  };

  const openNewColorEditor = (type: 'main' | 'neutral' | 'support') => {
    const colorCount = colors[type].length;
    const newColorName = `${type}-color-${colorCount + 1}`;

    setColor(ColorService.convert('hex', DEFAULT_COLOR));

    setEditorState({
      activePanel: 'add-color',
      colorType: type,
      index: colorCount,
      name: newColorName,
      initialName: newColorName,
      initialHex: DEFAULT_COLOR,
    });

    updateColorInParams(DEFAULT_COLOR, newColorName, type, colorCount);
  };

  const closeEditor = () => {
    setEditorState((prev) => ({
      ...prev,
      activePanel: 'none',
    }));
  };

  const removeColor = (index: number, type: 'main' | 'neutral' | 'support') => {
    if (index < 0) return;

    const updatedParams = new URLSearchParams(searchParams);

    if (type === 'main' || type === 'support') {
      const colorParam = searchParams.get(type) || '';
      const colorArray = colorParam.split(' ').filter(Boolean);
      colorArray.splice(index, 1);
      updatedParams.set(type, colorArray.join(' '));

      setSearchParams(updatedParams, { replace: true });
    }
  };

  return (
    <div>
      {editorState.activePanel === 'none' && (
        <>
          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs'>Main</Heading>
              {colors.main.length < 40 && (
                <Button
                  variant='tertiary'
                  data-size='sm'
                  className={classes.AddBtn}
                  onClick={() => openNewColorEditor('main')}
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
                  onClick={() => openColorEditor(colorTheme, index, 'main')}
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
                  onClick={() => openColorEditor(colorTheme, index, 'neutral')}
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
                  onClick={() => openNewColorEditor('support')}
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
                  onClick={() => openColorEditor(colorTheme, index, 'support')}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {(editorState.activePanel === 'add-color' ||
        editorState.activePanel === 'edit-color') && (
        <ColorPane
          onClose={() => {
            closeEditor();
          }}
          onRemove={() => {
            removeColor(editorState.index, editorState.colorType);
            closeEditor();
          }}
          onCancel={() => {
            if (editorState.activePanel === 'edit-color') {
              updateColorInParams(
                editorState.initialHex,
                editorState.initialName,
                editorState.colorType,
                editorState.index,
              );
            }
            closeEditor();
          }}
          type={editorState.activePanel}
          color={color}
          name={editorState.name}
          setColor={(newColor) => {
            setColor(newColor);
            updateColorInParams(
              newColor.hex,
              editorState.name,
              editorState.colorType,
              editorState.index,
            );
          }}
          setName={(newName) => {
            setEditorState((prev) => ({ ...prev, name: newName }));
            updateColorInParams(
              color.hex,
              newName,
              editorState.colorType,
              editorState.index,
            );
          }}
          colorType={editorState.colorType}
        />
      )}
    </div>
  );
};
