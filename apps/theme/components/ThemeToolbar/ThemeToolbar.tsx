import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';
import { NativeSelect } from '@digdir/designsystemet-react';
import type {
  ColorError,
  ColorType,
  ContrastMode,
} from '@digdir/designsystemet/color';

import { ColorPicker } from '../ColorPicker/ColorPicker';
import { TokenModal } from '../TokenModal/TokenModal';
import { useThemeStore } from '../../store';

import classes from './ThemeToolbar.module.css';

type ThemeToolbarProps = {
  accentError: ColorError;
  neutralError: ColorError;
  brand1Error: ColorError;
  brand2Error: ColorError;
  brand3Error: ColorError;
  borderRadius: string;
  onColorChanged: (type: ColorType, color: CssColor) => void;
  onContrastModeChanged: (mode: 'aa' | 'aaa') => void;
  onBorderRadiusChanged: (radius: string) => void;
  contrastMode: ContrastMode;
};

export const borderRadii = {
  '0 rem': '0',
  '0.25 rem': '0.25rem',
  '0.5 rem': '0.5rem',
  '0.75 rem': '0.75rem',
  '1 rem': '1rem',
  full: '99999px',
};

export const ThemeToolbar = ({
  accentError,
  neutralError,
  brand1Error,
  brand2Error,
  brand3Error,
  borderRadius,
  onColorChanged,
  onContrastModeChanged,
  onBorderRadiusChanged,
  contrastMode,
}: ThemeToolbarProps) => {
  const accentTheme = useThemeStore((state) => state.accentTheme);
  const neutralTheme = useThemeStore((state) => state.neutralTheme);
  const brandOneTheme = useThemeStore((state) => state.brandOneTheme);
  const brandTwoTheme = useThemeStore((state) => state.brandTwoTheme);
  const brandThreeTheme = useThemeStore((state) => state.brandThreeTheme);
  return (
    <div className={classes.pickersContainer}>
      <div className={cl(classes.pickers, 'pickers')}>
        <ColorPicker
          colorError={accentError}
          label='Accent'
          defaultColor={accentTheme.color}
          onColorChanged={(color) => {
            onColorChanged('accent', color);
          }}
        />
        <ColorPicker
          colorError={neutralError}
          label='Neutral'
          defaultColor={neutralTheme.color}
          onColorChanged={(color) => {
            onColorChanged('neutral', color);
          }}
        />
        <ColorPicker
          colorError={brand1Error}
          label='Brand 1'
          defaultColor={brandOneTheme.color}
          onColorChanged={(color) => {
            onColorChanged('brand1', color);
          }}
        />
        <ColorPicker
          colorError={brand2Error}
          label='Brand 2'
          defaultColor={brandTwoTheme.color}
          onColorChanged={(color) => {
            onColorChanged('brand2', color);
          }}
        />
        <ColorPicker
          colorError={brand3Error}
          label='Brand 3'
          defaultColor={brandThreeTheme.color}
          onColorChanged={(color) => {
            onColorChanged('brand3', color);
          }}
        />

        <div className={classes.dropdown}>
          <NativeSelect
            label='Kontrastnivå'
            size='md'
            className={classes.contrastSelect}
            value={contrastMode}
            onChange={(e) => {
              onContrastModeChanged(e.target.value as 'aa' | 'aaa');
            }}
          >
            <option value='aa'>AA</option>
            <option value='aaa'>AAA (WIP)</option>
          </NativeSelect>
        </div>
        <div className={classes.borderRadii}>
          <NativeSelect
            label='Border radius'
            size='md'
            className={classes.borderRadiiSelect}
            value={borderRadius}
            onChange={(e) => onBorderRadiusChanged(e.target.value)}
            style={{
              textTransform: 'capitalize',
            }}
          >
            {Object.entries(borderRadii).map(([key, value]) => (
              <option
                key={key}
                value={value}
                style={{
                  textTransform: 'capitalize',
                }}
              >
                {key}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className={classes.dropdown}>
          <TokenModal
            accentColor={accentTheme.color}
            neutralColor={neutralTheme.color}
            brand1Color={brandOneTheme.color}
            brand2Color={brandTwoTheme.color}
            brand3Color={brandThreeTheme.color}
            borderRadius={borderRadius}
          />
        </div>
      </div>
    </div>
  );
};
