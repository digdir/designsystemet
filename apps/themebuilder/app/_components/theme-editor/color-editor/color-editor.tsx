import {
  Button,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { ChevronLeftIcon, TrashIcon } from '@navikt/aksel-icons';
import { useEffect, useRef, useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import { colorNameError, sanitizeColorName } from '~/model/theme-workspace';
import classes from './color-editor.module.css';

type ColorEditorProps = {
  /** Whether the color was added when the editor opened. A new color cannot be cancelled, only removed. */
  isNew: boolean;
  hex: string;
  onColorChange: (hex: string) => void;
  /** The name in the name field */
  name: string;
  setName: (name: string) => void;
  /** The name the color has in the theme */
  committedName: string;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
  /** Whether the color has a name field */
  canRename: boolean;
  canRemove: boolean;
  /** Shown under the heading, to explain what cannot be done with the color */
  info?: string;
};

const nameErrors = {
  empty: 'colorEditor.name-empty-error',
  invalid: 'colorEditor.name-invalid-error',
  duplicate: 'colorEditor.name-duplicate-error',
  'severity-only': 'colorEditor.name-severity-only-error',
} as const;

/** The form for the name and base color of one color */
export const ColorEditor = ({
  isNew,
  hex,
  onColorChange,
  name,
  setName,
  committedName,
  onSave,
  onCancel,
  onRemove,
  canRename,
  canRemove,
  info,
}: ColorEditorProps) => {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    editorRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, []);
  /* The picker keeps its own color while it is dragged, and the theme gets it when the drag ends */
  const [pickerColor, setPickerColor] = useColor(hex);
  const [nameError, setNameError] = useState('');

  const checkName = () => {
    const error = canRename
      ? colorNameError(
          name,
          colors.map((color) => color.name),
          committedName,
        )
      : null;
    setNameError(error ? t(nameErrors[error]) : '');
    return !error;
  };

  return (
    <div ref={editorRef} className={classes.editor}>
      <div className={classes.actions}>
        <Button
          data-size='sm'
          variant='tertiary'
          onClick={() => checkName() && onSave()}
          className={classes.back}
        >
          <ChevronLeftIcon aria-hidden />
          {t('common.save')}
        </Button>
        <Button
          data-size='sm'
          variant='tertiary'
          data-color='neutral'
          hidden={isNew}
          onClick={onCancel}
          className={classes.cancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          data-size='sm'
          variant='tertiary'
          data-color='danger'
          onClick={onRemove}
          className={classes.removeBtn}
          hidden={!canRemove}
        >
          {t('colorEditor.remove-color')}
          <TrashIcon aria-hidden />
        </Button>
      </div>
      <Heading data-size='xs' className={classes.title}>
        {t(isNew ? 'colorEditor.add-color' : 'colorEditor.edit-color')}
      </Heading>
      {info && (
        <Paragraph data-size='sm' className={classes.desc}>
          {info}
        </Paragraph>
      )}
      {canRename && (
        <Textfield
          placeholder={t('colorEditor.name-placeholder')}
          label={t('colorEditor.name')}
          description={t('colorEditor.name-description')}
          className={classes.name}
          data-size='sm'
          value={name}
          onChange={(e) => setName(sanitizeColorName(e.currentTarget.value))}
          onBlur={checkName}
          error={nameError}
        />
      )}
      <div className={classes.label}>{t('colorEditor.color')}</div>
      <div className={classes.colorPreviewContainer}>
        <div
          style={{ backgroundColor: pickerColor.hex }}
          className={classes.colorPreview}
        />
      </div>
      <ColorPicker
        hideAlpha
        color={pickerColor}
        onChange={setPickerColor}
        onChangeComplete={(color) => onColorChange(color.hex)}
        hideInput={['rgb', 'hsv']}
      />
    </div>
  );
};
