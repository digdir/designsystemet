import {
  Card,
  Details,
  Heading,
  Input,
  Paragraph,
} from '@digdir/designsystemet-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { ColorTheme } from '~/routes/themebuilder/_utils/use-themebuilder';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './color-overrides.module.css';

const COLOR_TOKEN_NAMES = [
  'background-default',
  'background-tinted',
  'surface-default',
  'surface-tinted',
  'surface-hover',
  'surface-active',
  'border-subtle',
  'border-default',
  'border-strong',
  'text-subtle',
  'text-default',
  'base-default',
  'base-hover',
  'base-active',
  'base-contrast-subtle',
  'base-contrast-default',
] as const;

type TokenName = (typeof COLOR_TOKEN_NAMES)[number];

export const ColorOverrides = () => {
  const { colors, severityColors, severityEnabled } = useThemebuilder();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localValues, setLocalValues] = useState<
    Record<string, Record<string, { light?: string; dark?: string }>>
  >({});

  const allColors: Array<{ color: ColorTheme; type: string }> = [
    ...colors.main.map((c) => ({ color: c, type: 'main' })),
    ...colors.neutral.map((c) => ({ color: c, type: 'neutral' })),
    ...colors.support.map((c) => ({ color: c, type: 'support' })),
    ...(severityEnabled
      ? severityColors.map((c) => ({
          color: c as ColorTheme,
          type: 'severity',
        }))
      : []),
  ];
  const handleLocalChange = (
    colorName: string,
    tokenName: TokenName,
    mode: 'light' | 'dark',
    value: string,
  ) => {
    setLocalValues((prev) => {
      const newValues = { ...prev };
      if (!newValues[colorName]) {
        newValues[colorName] = {};
      }
      if (!newValues[colorName][tokenName]) {
        newValues[colorName][tokenName] = {};
      }
      newValues[colorName][tokenName][mode] = value;
      return newValues;
    });
  };

  const handleBlur = (colorName: string, tokenName: TokenName) => {
    const localOverride = localValues[colorName]?.[tokenName];
    if (!localOverride) return;

    const currentOverrides = searchParams.get('color-overrides') || '';
    const overridesArray = currentOverrides
      ? currentOverrides.split(' ').filter(Boolean)
      : [];

    // Find the existing override for this color/token combo
    const existingIndex = overridesArray.findIndex((o) =>
      o.startsWith(`${colorName}|${tokenName}|`),
    );

    // Remove existing override
    if (existingIndex >= 0) {
      overridesArray.splice(existingIndex, 1);
    }

    // Add back to array if there are any overrides with values
    const hasLight = localOverride.light?.trim();
    const hasDark = localOverride.dark?.trim();

    if (hasLight || hasDark) {
      const parts = [colorName, tokenName];
      if (hasLight && localOverride.light)
        parts.push(`light:${localOverride.light.trim()}`);
      if (hasDark && localOverride.dark)
        parts.push(`dark:${localOverride.dark.trim()}`);
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

  const getOverrideValue = (
    colorName: string,
    tokenName: TokenName,
    mode: 'light' | 'dark',
  ): string => {
    const localValue = localValues[colorName]?.[tokenName]?.[mode];
    if (localValue !== undefined) {
      return localValue;
    }

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

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Heading data-size='2xs'>Color Overrides</Heading>
        <Paragraph data-size='sm' className={classes.description}>
          Override specific token colors for light and dark modes
        </Paragraph>
      </div>

      <Card data-color='neutral'>
        {allColors.map(({ color }) => {
          return (
            <Details key={color.name}>
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
                {COLOR_TOKEN_NAMES.map((tokenName) => {
                  const lightValue = getOverrideValue(
                    color.name,
                    tokenName,
                    'light',
                  );
                  const darkValue = getOverrideValue(
                    color.name,
                    tokenName,
                    'dark',
                  );

                  return (
                    <div key={tokenName} className={classes.tokenRow}>
                      <div className={classes.tokenName}>{tokenName}</div>
                      <div className={classes.tokenInputs}>
                        <Input
                          data-size='sm'
                          placeholder='Light #hex'
                          value={lightValue}
                          onChange={(e) =>
                            handleLocalChange(
                              color.name,
                              tokenName,
                              'light',
                              e.target.value,
                            )
                          }
                          onBlur={() => handleBlur(color.name, tokenName)}
                          className={classes.input}
                        />
                        <Input
                          data-size='sm'
                          placeholder='Dark #hex'
                          value={darkValue}
                          onChange={(e) =>
                            handleLocalChange(
                              color.name,
                              tokenName,
                              'dark',
                              e.target.value,
                            )
                          }
                          onBlur={() => handleBlur(color.name, tokenName)}
                          className={classes.input}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Details>
          );
        })}
      </Card>
    </div>
  );
};
