import {
  type ColorNames,
  type CssColor,
  RESERVED_COLORS,
  getContrastFromHex,
} from '@digdir/designsystemet';
import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon, CogIcon, TrashIcon } from '@navikt/aksel-icons';
import { ColorPicker, type IColor } from 'react-color-palette';
import { useThemeStore } from '../../../store';

import cl from 'clsx/lite';
import { useState } from 'react';
import { AdvancedColorPage } from '../AdvancedColorPage/AdvancedColorPage';
import classes from './ColorPane.module.css';

type ColorPaneProps = {
  onClose: () => void;
  type: 'add-color' | 'edit-color' | 'none';
  color: IColor;
  setColor: (color: IColor) => void;
  name: string;
  setName: (name: string) => void;
  onCancel: () => void;
  onRemove: () => void;
  colorType: 'main' | 'neutral' | 'support' | 'status';
  index: number;
};

export const ColorPane = ({
  onClose,
  type,
  color,
  setColor,
  name,
  onCancel,
  setName,
  onRemove,
  index,
  colorType,
}: ColorPaneProps) => {
  const mainColors = useThemeStore((state) => state.colors.main);
  const [colorError, setColorError] = useState('');
  const [advancedColors, setAdvancedColors] = useState(false);
  const colorScheme = useThemeStore((state) => state.colorScheme);

  const getHeading = () => {
    const t = colorType === 'main' ? 'hovedfarge' : 'støttefarge';
    if (type === 'add-color') {
      return 'Legg til ' + t;
    }
    return colorType === 'main' ? 'Rediger farge' : `Rediger ${name}`;
  };

  const checkNameIsValid = () => {
    if (colorType === 'neutral' || colorType === 'status') return true;

    if (name === '') {
      setColorError('Navnet på fargen kan ikke være tomt');
      return false;
    }

    if (RESERVED_COLORS.includes(name.toLowerCase())) {
      setColorError(
        'Navnet på fargen kan ikke være det samme som våre systemfarger',
      );
      return false;
    }
    setColorError('');
    return true;
  };

  const closeTab = () => {
    setColorError('');
    onClose();
  };

  const colorsToTestAgainst: ColorNames[] = [
    'background-default',
    'background-tinted',
    'surface-default',
    'surface-tinted',
    'surface-hover',
    'surface-active',
  ];

  const showAlert = () => {
    for (const colorName of colorsToTestAgainst) {
      const hex1 = mainColors[0].colors[colorScheme].find(
        (color) => color.name === colorName,
      )?.hex;
      const hex2 = color.hex as CssColor;

      if (hex1 && hex2 && getContrastFromHex(hex1, hex2) <= 3.1) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      className={cl(classes.colorPage, type.includes('color') && classes.show)}
    >
      {!advancedColors && (
        <>
          <div className={classes.topBtnGroup}>
            <Button
              data-size='sm'
              variant='tertiary'
              onClick={() => {
                /* Check here as well to disable sending new color */
                if (!checkNameIsValid()) return;
                closeTab();
              }}
              className={classes.back}
            >
              <ChevronLeftIcon aria-hidden fontSize='1.5rem' /> Farger
            </Button>
            <Button
              data-size='sm'
              variant='tertiary'
              data-color='neutral'
              hidden={type !== 'edit-color'}
              onClick={() => {
                onCancel();
              }}
              className={classes.cancel}
            >
              Avbryt
            </Button>
            <Button
              data-size='sm'
              variant='tertiary'
              data-color='danger'
              onClick={() => {
                onRemove();
              }}
              className={cl(classes.removeBtn)}
              hidden={
                colorType === 'neutral' ||
                colorType === 'status' ||
                (colorType === 'main' && mainColors.length <= 1)
              }
            >
              Fjern farge
              <TrashIcon title='søppelkasse' fontSize='1.5rem' />
            </Button>
          </div>
          <Heading data-size='xs' className={classes.title}>
            {getHeading()}
          </Heading>
          {/* {showAlert() && (
            <div className={classes.alert}>
              Fargen har lav kontrast mot en eller flere av overflatefargene som
              påvirker bruken. Les mer om hva dette betyr på kontrast siden.
            </div>
          )} */}
          {colorType === 'neutral' ||
            (colorType === 'status' && (
              <Paragraph data-size='sm' className={classes.desc}>
                Du kan ikke endre navnet på denne fargen.
              </Paragraph>
            ))}
          {colorType !== 'neutral' && colorType !== 'status' && (
            <Textfield
              placeholder='Skriv navnet her...'
              label='Navn'
              description='Bruk kun bokstavene a-z, tall og bindestrek'
              className={classes.name}
              data-size='sm'
              value={name}
              onChange={(e) => {
                const value = e.currentTarget.value
                  .replace(/\s+/g, '-')
                  .replace(/[^A-Z0-9-]+/gi, '')
                  .toLowerCase();
                setName(value);
              }}
              onBlur={checkNameIsValid}
              error={colorError}
            />
          )}
          <div className={classes.label}>Farge</div>
          <div className={classes.colorPreviewContainer}>
            <div
              style={{ backgroundColor: color.hex }}
              className={classes.colorPreview}
            ></div>
          </div>
          <ColorPicker
            hideAlpha
            color={color}
            onChange={setColor}
            hideInput={['rgb', 'hsv']}
            onChangeComplete={(color) => {}}
          />
          <Button
            className={classes.advancedBtn}
            variant='tertiary'
            data-size='sm'
            data-color='neutral'
            onClick={() => setAdvancedColors(true)}
          >
            <CogIcon title='tannhjul' fontSize='1.5rem' />
            Avanserte fargeinnstillinger
          </Button>
        </>
      )}

      {advancedColors && (
        <AdvancedColorPage
          onBackClicked={() => setAdvancedColors(false)}
          colorType={colorType}
          index={index}
          name={name}
          color={color.hex}
        />
      )}
    </div>
  );
};
