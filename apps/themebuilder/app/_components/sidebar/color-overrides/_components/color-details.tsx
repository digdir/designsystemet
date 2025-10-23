import { colorNames } from '@digdir/designsystemet/color';
import { Details, Field, Input, Label } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { ColorTheme } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from '../color-overrides.module.css';

type ColorDetailsProps = {
  color: ColorTheme;
};

type ColorOverrideInputProps = {
  colorName: string;
  tokenName: string;
  mode: 'light' | 'dark';
  defaultColor?: string;
};

const ColorOverrideInput = ({
  colorName,
  tokenName,
  mode,
  defaultColor,
}: ColorOverrideInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localValue, setLocalValue] = useState<string | undefined>(undefined);

  // Get the committed value from URL
  const getCommittedValue = (): string => {
    const currentOverrides = searchParams.get('color-overrides') || '';
    const overridesArray = currentOverrides
      ? currentOverrides.split(' ').filter(Boolean)
      : [];

    const override = overridesArray.find((o) =>
      o.startsWith(`${colorName}|${tokenName}|`),
    );

    if (!override) return '';

    const parts = override.split('|');
    for (let i = 2; i < parts.length; i++) {
      const [m, hex] = parts[i].split(':');
      if (m === mode) return hex;
    }

    return '';
  };

  const committedValue = getCommittedValue();

  // Clear local value if it matches the committed value (URL has updated)
  if (localValue !== undefined && localValue.trim() === committedValue) {
    setLocalValue(undefined);
  }

  const displayValue = localValue !== undefined ? localValue : committedValue;

  const handleChange = (value: string) => {
    setLocalValue(value);
  };

  const handleBlur = () => {
    if (localValue === undefined) return;

    const currentOverrides = searchParams.get('color-overrides') || '';
    const overridesArray = currentOverrides
      ? currentOverrides.split(' ').filter(Boolean)
      : [];

    // Find the existing override for this color/token combo
    const existingIndex = overridesArray.findIndex((o) =>
      o.startsWith(`${colorName}|${tokenName}|`),
    );

    // Get current values from URL to preserve the other mode
    let currentLight = '';
    let currentDark = '';
    if (existingIndex >= 0) {
      const parts = overridesArray[existingIndex].split('|');
      for (let i = 2; i < parts.length; i++) {
        const [m, hex] = parts[i].split(':');
        if (m === 'light') currentLight = hex;
        if (m === 'dark') currentDark = hex;
      }
    }

    // Remove existing override
    if (existingIndex >= 0) {
      overridesArray.splice(existingIndex, 1);
    }

    // Update the value for this mode
    const finalLight = mode === 'light' ? localValue.trim() : currentLight;
    const finalDark = mode === 'dark' ? localValue.trim() : currentDark;

    if (finalLight || finalDark) {
      const parts = [colorName, tokenName];
      if (finalLight) parts.push(`light:${finalLight}`);
      if (finalDark) parts.push(`dark:${finalDark}`);
      overridesArray.push(parts.join('|'));
    }

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (overridesArray.length > 0) {
      newParams.set('color-overrides', overridesArray.join(' '));
    } else {
      newParams.delete('color-overrides');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  return (
    <Field data-size='sm'>
      <Label>
        <span className="ds-sr-only">{colorName} </span>
        {tokenName} {mode === 'light' ? 'Light' : 'Dark'}
      </Label>
      <Field.Affixes>
        <Field.Affix>
          <div
            className={classes.colorPreview}
            style={{
              backgroundColor: committedValue || defaultColor,
            }}
          />
        </Field.Affix>
        <Input
          placeholder='#hex'
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={classes.input}
        />
      </Field.Affixes>
    </Field>
  );
};

export default function ColorDetails({ color }: ColorDetailsProps) {
  return (
    <Details>
      <Details.Summary>
        <div className={classes.colorInfo}>
          <div
            className={classes.colorSwatch}
            style={{ backgroundColor: color.hex }}
          />
          <span className={classes.colorName}>{color.name}</span>
        </div>
      </Details.Summary>

      <div className={classes.tokenList}>
        {colorNames.map((tokenName) => {
          // Get the actual colors from the theme to show preview
          const lightColor = color.colors?.light?.find(
            (c) => c.name === tokenName,
          );
          const darkColor = color.colors?.dark?.find(
            (c) => c.name === tokenName,
          );

          return (
            <div key={tokenName} className={classes.tokenRow}>
              <div className={classes.tokenInputsWrapper}>
                <div className={classes.tokenInputGroup}>
                  <ColorOverrideInput
                    colorName={color.name}
                    tokenName={tokenName}
                    mode='light'
                    defaultColor={lightColor?.hex}
                  />
                </div>
                <div className={classes.tokenInputGroup}>
                  <ColorOverrideInput
                    colorName={color.name}
                    tokenName={tokenName}
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
