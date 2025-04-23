import { RESERVED_COLORS } from '@digdir/designsystemet';
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
  colorType: 'main' | 'neutral' | 'support';
  onStaticSaturation: (saturation: number) => void;
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
  colorType,
  onStaticSaturation,
}: ColorPaneProps) => {
  const mainColors = useThemeStore((state) => state.colors.main);
  const [colorError, setColorError] = useState('');
  const [advancedColors, setAdvancedColors] = useState(false);

  const getHeading = () => {
    const t = colorType === 'main' ? 'hovedfarge' : 'støttefarge';
    return type === 'add-color' ? 'Legg til ' + t : 'Rediger farge';
  };

  const checkNameIsValid = () => {
    if (colorType === 'neutral') return true;

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
              <ChevronLeftIcon aria-hidden fontSize='1.5rem' /> Lagre
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
          {colorType === 'neutral' && (
            <Paragraph data-size='sm' className={classes.desc}>
              Neutral fargen kan ikke fjernes eller endres navn på.
            </Paragraph>
          )}
          {colorType !== 'neutral' && (
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
          onLightStaticSaturation={onStaticSaturation}
        />
      )}
    </div>
  );
};
