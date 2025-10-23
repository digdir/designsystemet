import { RESERVED_COLORS } from '@digdir/designsystemet';
import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon, TrashIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useState } from 'react';
import { ColorPicker, type IColor, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './color-pane.module.css';

type ColorPaneProps = {
  onClose: () => void;
  type: 'add-color' | 'edit-color' | 'none';
  color: IColor;
  setColor: (color: IColor) => void;
  name: string;
  setName: (name: string) => void;
  onCancel: () => void;
  onRemove: () => void;
  colorType: 'main' | 'neutral' | 'support' | 'severity';
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
}: ColorPaneProps) => {
  const { t } = useTranslation();
  const [localColor, setLocalColor] = useColor(color.hex);

  const {
    colors: { main: mainColors },
  } = useThemebuilder();
  const [colorError, setColorError] = useState('');
  const headingText = (() => {
    const colorTypeText =
      colorType === 'main'
        ? t('colorPane.main-color')
        : t('colorPane.support-color');
    return type === 'add-color'
      ? `${t('colorPane.add')} ${colorTypeText}`
      : t('colorPane.edit-color');
  })();

  const checkNameIsValid = () => {
    if (colorType === 'neutral') return true;
    if (colorType === 'severity') return true;
    if (!name?.trim()) {
      setColorError(t('colorPane.name-empty-error'));
      return false;
    }

    const nameLower = name.toLowerCase();
    if (RESERVED_COLORS.includes(nameLower)) {
      setColorError(t('colorPane.name-reserved-error'));
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
            if (!checkNameIsValid()) return;
            closeTab();
          }}
          className={classes.back}
        >
          <ChevronLeftIcon aria-hidden fontSize='1.5rem' />
          {t('colorPane.save')}
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
          {t('colorPane.cancel')}
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
            colorType === 'severity' ||
            (colorType === 'main' && mainColors.length <= 1)
          }
        >
          {t('colorPane.remove-color')}
          <TrashIcon title='trash' fontSize='1.5rem' />
        </Button>
      </div>
      <Heading data-size='xs' className={classes.title}>
        {headingText}
      </Heading>
      {colorType === 'neutral' && (
        <Paragraph data-size='sm' className={classes.desc}>
          {t('colorPane.neutral-info')}
        </Paragraph>
      )}
      {colorType === 'severity' && (
        <Paragraph data-size='sm' className={classes.desc}>
          {t('colorPane.severity-info')}
        </Paragraph>
      )}
      {colorType !== 'neutral' && colorType !== 'severity' && (
        <Textfield
          placeholder={t('colorPane.name-placeholder')}
          label={t('colorPane.name')}
          description={t('colorPane.name-description')}
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
      <div className={classes.label}>{t('colorPane.color')}</div>
      <div className={classes.colorPreviewContainer}>
        <div
          style={{ backgroundColor: localColor.hex }}
          className={classes.colorPreview}
        />
      </div>
      <ColorPicker
        hideAlpha
        color={localColor}
        onChange={setLocalColor}
        onChangeComplete={setColor}
        hideInput={['rgb', 'hsv']}
      />
    </div>
  );
};
