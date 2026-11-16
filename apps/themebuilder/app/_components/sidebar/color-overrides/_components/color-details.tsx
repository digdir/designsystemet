import {
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
import type { ColorTheme } from '~/_hooks/use-themebuilder';
import { useThemeStore } from '~/model/theme-store';
import { setColorOverride } from '~/model/theme-workspace';
import classes from '../color-overrides.module.css';

type ColorDetailsProps = {
  color: ColorTheme;
};

type ColorOverrideInputProps = {
  colorName: string;
  tokenName: SemanticColorNames;
  mode: 'light' | 'dark';
  defaultColor?: string;
};

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

const ColorOverrideInput = ({
  colorName,
  tokenName,
  mode,
  defaultColor,
}: ColorOverrideInputProps) => {
  const { theme, updateTheme } = useThemeStore();
  const [localValue, setLocalValue] = useState<string | undefined>(undefined);
  const [validHex, setValidHex] = useState(true);

  const genId = useId();
  const colorInputId = `color-input-${genId}`;
  const inputId = `input-${genId}`;

  const committedValue =
    theme.overrides?.colors?.[colorName]?.[tokenName]?.[mode] || '';

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
    const hexRegex = new RegExp(`^(${hexPatterns.join('|')})$`);
    if (value && !hexRegex.test(value)) {
      setValidHex(false);
      return;
    }

    updateTheme((theme) =>
      setColorOverride(theme, colorName, tokenName, mode, value),
    );
  };

  return (
    <div className='ds-field'>
      <Label htmlFor={inputId}>
        <span className='ds-sr-only'>{colorName} </span>
        {semanticColorSpec[tokenName].displayName}{' '}
        {mode === 'light' ? 'Light' : 'Dark'}
      </Label>
      <Field.Affixes>
        <Field.Affix aria-hidden='false'>
          <label htmlFor={colorInputId} className='ds-sr-only'>
            {colorName} color picker
          </label>
          <input
            type='color'
            value={displayValue || defaultColor || '#000000'}
            onChange={(e) => {
              handleChange(e.target.value);
              setValidHex(true);
            }}
            onBlur={handleBlur}
            className={cl(classes.colorInput, 'ds-focus')}
            title='Pick a color'
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
        <ValidationMessage>
          Please enter a valid hex color code.
        </ValidationMessage>
      )}
    </div>
  );
};

export default function ColorDetails({ color }: ColorDetailsProps) {
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

      <div className={classes.tokenList}>
        {semanticColorNames.map((colorName) => {
          // Get the actual colors from the theme to show preview
          const lightColor = color.colors?.light?.[colorName];
          const darkColor = color.colors?.dark?.[colorName];

          return (
            <div key={colorName} className={classes.tokenRow}>
              <div className={classes.tokenInputsWrapper}>
                <div className={classes.tokenInputGroup}>
                  <ColorOverrideInput
                    colorName={color.name}
                    tokenName={colorName}
                    mode='light'
                    defaultColor={lightColor?.hex}
                  />
                </div>
                <div className={classes.tokenInputGroup}>
                  <ColorOverrideInput
                    colorName={color.name}
                    tokenName={colorName}
                    mode='dark'
                    defaultColor={darkColor?.hex}
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
