import {
  Button,
  Heading,
  Paragraph,
  Switch,
} from '@digdir/designsystemet-react';
import { PencilIcon, PlusIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type {
  ColorTheme,
  SeverityColorTheme,
} from '~/routes/themebuilder/_utils/use-themebuilder';
import {
  QUERY_SEPARATOR,
  useThemebuilder,
} from '~/routes/themebuilder/_utils/use-themebuilder';
import { ColorInput } from '../../color-input/color-input';
import { ColorOverrides } from '../color-overrides/color-overrides';
import { ColorPane } from '../color-pane/color-pane';
import classes from './color-page.module.css';

type ColorEditorState = {
  activePanel: 'add-color' | 'edit-color' | 'edit-severity' | 'none';
  colorType: 'main' | 'neutral' | 'support' | 'severity';
  index: number;
  name: string;
  initialName: string;
  initialHex: string;
};

const DEFAULT_COLOR = '#0062ba';

export const ColorPage = () => {
  const { t } = useTranslation();
  const { colors, severityColors, severityEnabled } = useThemebuilder();
  const [query, setQuery] = useSearchParams();

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

    const updatedParams = new URLSearchParams(query);

    if (type === 'main' || type === 'support') {
      const colorParam = query.get(type) || '';
      const colorArray = colorParam.split(QUERY_SEPARATOR).filter(Boolean);

      if (index < colorArray.length) {
        colorArray[index] = `${name}:${hex}`;
      } else {
        colorArray.push(`${name}:${hex}`);
      }

      updatedParams.set(type, colorArray.join(QUERY_SEPARATOR));
    } else if (type === 'neutral') {
      updatedParams.set('neutral', hex);
    } else if (type === 'severity') {
      updateSeverityColorInParams(hex, name, updatedParams);
    }

    setQuery(updatedParams, { replace: true, preventScrollReset: true });
  };

  const updateSeverityColorInParams = (
    hex: string,
    name: string,
    params: URLSearchParams,
  ) => {
    const severityParam = params.get('severity') || '';
    const severityArray = severityParam.split(QUERY_SEPARATOR).filter(Boolean);

    // Find the severity color and check if it's the default
    const defaultColor = severityColors.find((sc) => sc.name === name);
    if (!defaultColor) return;

    const isDefault = hex.toLowerCase() === defaultColor.hex.toLowerCase();

    // Remove existing entry for this severity color
    const filtered = severityArray.filter((s) => !s.startsWith(`${name}:`));

    // Only add if it's not the default value
    if (!isDefault) {
      filtered.push(`${name}:${hex}`);
    }

    if (filtered.length > 0) {
      params.set('severity', filtered.join(QUERY_SEPARATOR));
    } else {
      params.delete('severity');
    }
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

  const openSeverityColorEditor = (
    severityColor: SeverityColorTheme,
    index: number,
  ) => {
    const hexColor = severityColor.hex;

    setColor(ColorService.convert('hex', hexColor));

    setEditorState({
      activePanel: 'edit-severity',
      colorType: 'severity',
      index: index,
      name: severityColor.name,
      initialName: severityColor.name,
      initialHex: hexColor,
    });
  };

  const closeEditor = () => {
    setEditorState((prev) => ({
      ...prev,
      activePanel: 'none',
    }));
  };

  const removeColor = (index: number, type: 'main' | 'neutral' | 'support') => {
    if (index < 0) return;

    const updatedParams = new URLSearchParams(query);

    if (type === 'main' || type === 'support') {
      const colorParam = query.get(type) || '';
      const colorArray = colorParam.split(QUERY_SEPARATOR).filter(Boolean);
      colorArray.splice(index, 1);
      updatedParams.set(type, colorArray.join(QUERY_SEPARATOR));

      setQuery(updatedParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  };

  const toggleSeverityColors = (enabled: boolean) => {
    const updatedParams = new URLSearchParams(query);
    if (enabled) {
      updatedParams.set('severity-enabled', 'true');
    } else {
      updatedParams.delete('severity-enabled');
      updatedParams.delete('severity'); // Also remove any severity color overrides
    }
    setQuery(updatedParams, { replace: true, preventScrollReset: true });
  };

  return (
    <div>
      {editorState.activePanel === 'none' && (
        <>
          <div className={classes.overridesSection}>
            <ColorOverrides
              triggerButton={
                <Button
                  variant='secondary'
                  data-size='sm'
                  className={classes.overridesBtn}
                >
                  <PencilIcon aria-hidden fontSize='1.25rem' />
                  Token Overrides
                </Button>
              }
            />
          </div>
          <div className={classes.separator}></div>
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
                <div className={classes.error}>
                  {t('themeModal.max-X-colors', { count: 4 })}
                </div>
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

          <div className={classes.separator}></div>
          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs' id='severity-colors-heading'>
                {t('themeModal.severity-colors')}
              </Heading>
              <Switch
                name='severity-colors-switch'
                data-size='sm'
                checked={severityEnabled}
                onChange={(e) => toggleSeverityColors(e.target.checked)}
                aria-labelledby='severity-colors-heading'
                aria-describedby='severity-colors-description'
              />
            </div>
            {!severityEnabled && (
              <Paragraph
                id='severity-colors-description'
                data-size='sm'
                style={{
                  marginTop: '-4px',
                  marginBottom: '8px',
                  color: 'var(--ds-color-neutral-text-subtle)',
                }}
              >
                {t('themeModal.severity-colors-switch')}
              </Paragraph>
            )}
            {severityEnabled && (
              <div className={classes.colors}>
                {severityColors.map((severityColor, index) => (
                  <ColorInput
                    key={severityColor.name}
                    color={severityColor.hex}
                    name={severityColor.name}
                    onClick={() =>
                      openSeverityColorEditor(severityColor, index)
                    }
                  />
                ))}
              </div>
            )}
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
            if (
              editorState.colorType === 'main' ||
              editorState.colorType === 'support'
            ) {
              removeColor(editorState.index, editorState.colorType);
            }
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
          colorType={
            editorState.colorType === 'severity'
              ? 'neutral'
              : editorState.colorType
          }
        />
      )}

      {editorState.activePanel === 'edit-severity' && (
        <ColorPane
          onClose={() => {
            closeEditor();
          }}
          onRemove={() => {
            // Reset to default by removing from query params
            const updatedParams = new URLSearchParams(query);
            updateSeverityColorInParams(
              editorState.initialHex,
              editorState.name,
              updatedParams,
            );
            setQuery(updatedParams, {
              replace: true,
              preventScrollReset: true,
            });
            closeEditor();
          }}
          onCancel={() => {
            updateColorInParams(
              editorState.initialHex,
              editorState.initialName,
              editorState.colorType,
              editorState.index,
            );
            closeEditor();
          }}
          type='edit-color'
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
          setName={() => {
            // Name changes not allowed for severity colors
          }}
          colorType='severity'
        />
      )}
    </div>
  );
};
