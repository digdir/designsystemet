import { RESERVED_COLORS } from '@digdir/designsystemet';
import {
  Button,
  Heading,
  Paragraph,
  Textfield,
  Tooltip,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon, TrashIcon } from '@navikt/aksel-icons';
import { ColorPicker, type IColor } from 'react-color-palette';
import { useThemeStore } from '../../../store';

import cl from 'clsx/lite';
import { useState } from 'react';
import classes from './ColorPane.module.css';

type ColorPaneProps = {
  onClose: () => void;
  show?: boolean;
  type: 'add-color' | 'edit-color' | 'none';
  color: IColor;
  setColor: (color: IColor) => void;
  name: string;
  setName: (newName: string, oldName: string) => void;
  onCancel: (color: IColor, name: string) => void;
  onRemove: () => void;
  colorType: 'main' | 'neutral' | 'support';
};

export const ColorPane = ({
  onClose,
  show = false,
  type,
  color,
  setColor,
  name,
  onCancel,
  setName,
  onRemove,
  colorType,
}: ColorPaneProps) => {
  const mainColors = useThemeStore((state) => state.colors.main);
  const [colorError, setColorError] = useState('');
  const [initialColor, setInitialColor] = useState(color);
  const [initialName, setInitialName] = useState(name);

  const disableRemoveButton = colorType === 'main' && mainColors.length === 1;

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
          <ChevronLeftIcon aria-hidden fontSize='1.5rem' />{' '}
          {type === 'add-color' ? 'Legg til' : 'Lagre'}
        </Button>
        <Button
          data-size='sm'
          variant='tertiary'
          data-color='neutral'
          hidden={type !== 'edit-color'}
          onClick={() => {
            onCancel(initialColor, initialName);
          }}
          className={classes.cancel}
        >
          Avbryt
        </Button>
        <Tooltip
          content='Du må ha minst en hovedfarge'
          hidden={!disableRemoveButton}
        >
          <Button
            data-size='sm'
            variant='tertiary'
            data-color='danger'
            onClick={() => {
              if (disableRemoveButton) return;
              onRemove();
            }}
            className={cl(classes.removeBtn)}
            aria-disabled={disableRemoveButton || undefined}
          >
            Fjern farge
            <TrashIcon title='søppelkasse' fontSize='1.5rem' />
          </Button>
        </Tooltip>
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
            setName(value, name);
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
    </div>
  );
};
