import {
  type ColorScheme,
  isHexColor,
  type SemanticColorNames,
  semanticColorNames,
  semanticColorSpec,
} from '@digdir/designsystemet/internal';
import {
  Details,
  Field,
  Input,
  Label,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ThemeColor } from '~/model/theme-colors';
import { useThemeStore } from '~/model/theme-store';
import { setColorOverride } from '~/model/theme-workspace';
import classes from './color-overrides-dialog.module.css';

type ColorOverrideSectionProps = {
  color: ThemeColor;
};

type ColorOverrideInputProps = {
  colorName: string;
  step: SemanticColorNames;
  colorScheme: ColorScheme;
  defaultColor?: string;
};

/** `<input type='color'>` only takes `#rrggbb`, while an override can also be `#rgb`, `#rgba` or `#rrggbbaa` */
const toPickerValue = (hex: string) => {
  const digits = hex.slice(1);
  if (!isHexColor(hex)) return undefined;
  return digits.length <= 4
    ? `#${[...digits.slice(0, 3)].map((digit) => digit + digit).join('')}`
    : `#${digits.slice(0, 6)}`;
};

const ColorOverrideInput = ({
  colorName,
  step,
  colorScheme,
  defaultColor,
}: ColorOverrideInputProps) => {
  const { t } = useTranslation();
  const { theme, updateTheme } = useThemeStore();
  const [localValue, setLocalValue] = useState<string | undefined>(undefined);
  const [validHex, setValidHex] = useState(true);

  const genId = useId();
  const colorInputId = `color-input-${genId}`;
  const inputId = `input-${genId}`;

  const committedValue =
    theme.overrides?.colors?.[colorName]?.[step]?.[colorScheme] || '';

  // Clear local value if it matches the committed value (the theme has updated)
  if (localValue !== undefined && localValue.trim() === committedValue) {
    setLocalValue(undefined);
  }

  const displayValue = localValue !== undefined ? localValue : committedValue;

  const handleChange = (value: string) => {
    setLocalValue(value);
  };

  const handleBlur = () => {
    if (localValue === undefined) return;

    const value = localValue.trim();
    if (value && !isHexColor(value)) {
      setValidHex(false);
      return;
    }

    updateTheme((theme) =>
      setColorOverride(theme, colorName, step, colorScheme, value),
    );
  };

  return (
    <div className='ds-field'>
      <Label htmlFor={inputId}>
        <span className='ds-sr-only'>{colorName} </span>
        {semanticColorSpec[step].displayName}{' '}
        {t(`appearanceToggle.${colorScheme}`)}
      </Label>
      <Field.Affixes>
        <Field.Affix aria-hidden='false'>
          <label htmlFor={colorInputId} className='ds-sr-only'>
            {colorName} {t('overrides.color-picker')}
          </label>
          <input
            type='color'
            value={
              toPickerValue(displayValue) ||
              toPickerValue(defaultColor || '') ||
              '#000000'
            }
            onChange={(e) => {
              handleChange(e.target.value);
              setValidHex(true);
            }}
            onBlur={handleBlur}
            className={cl(classes.colorInput, 'ds-focus')}
            id={colorInputId}
          />
        </Field.Affix>
        <Input
          id={inputId}
          placeholder='#hex'
          value={displayValue}
          onChange={(e) => {
            handleChange(e.target.value);
            setValidHex(true);
          }}
          onBlur={handleBlur}
          className={classes.input}
        />
      </Field.Affixes>
      {!validHex && (
        <ValidationMessage>{t('overrides.invalid-hex')}</ValidationMessage>
      )}
    </div>
  );
};

/** The override fields for every step of one color, in light and dark mode */
export function ColorOverrideSection({ color }: ColorOverrideSectionProps) {
  return (
    <Details suppressHydrationWarning>
      <Details.Summary suppressHydrationWarning>
        <div className={classes.colorInfo}>
          <div
            className={classes.colorSwatch}
            style={{ backgroundColor: color.hex }}
          />
          <span className={classes.colorName}>{color.name}</span>
        </div>
      </Details.Summary>

      <div className={classes.stepList}>
        {semanticColorNames.map((step) => {
          // Get the actual colors from the theme to show preview
          const lightColor = color.colors.light[step];
          const darkColor = color.colors.dark[step];

          return (
            <div key={step} className={classes.stepRow}>
              <div className={classes.stepInputs}>
                <div className={classes.stepInput}>
                  <ColorOverrideInput
                    colorName={color.name}
                    step={step}
                    colorScheme='light'
                    defaultColor={lightColor.hex}
                  />
                </div>
                <div className={classes.stepInput}>
                  <ColorOverrideInput
                    colorName={color.name}
                    step={step}
                    colorScheme='dark'
                    defaultColor={darkColor.hex}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Details>
  );
}
