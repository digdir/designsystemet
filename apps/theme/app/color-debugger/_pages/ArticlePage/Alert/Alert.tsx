import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useDebugStore } from '../../../debugStore';
import { generateColorSchemes } from '../../../logic/theme';
import { ColorIndexes } from '../../../utils';
import classes from './Alert.module.css';

type AlertProps = {
  type: 'success' | 'warning' | 'info' | 'error';
};

export const Alert = ({ type }: AlertProps) => {
  const luminance = useDebugStore((state) => state.luminance);
  const themeSettings = useDebugStore((state) => state.themeSettings);

  const success = generateColorSchemes('#068718', luminance, themeSettings);
  const warning = generateColorSchemes('#ea9b1b', luminance, themeSettings);
  const info = generateColorSchemes('#0A71C0', luminance, themeSettings);
  const error = generateColorSchemes('#C01B1B', luminance, themeSettings);

  const getAlertBackground = (
    type: 'success' | 'warning' | 'info' | 'error',
    index: number,
  ) => {
    const colorSchemes = {
      success,
      warning,
      info,
      error,
    };

    return colorSchemes[type].light[index].hex;
  };

  return (
    <div
      className={cl(classes.alert)}
      style={{
        backgroundColor: getAlertBackground(type, ColorIndexes.surfaceTinted),
        border:
          '1px solid' + getAlertBackground(type, ColorIndexes.borderSubtle),
      }}
    >
      <ExclamationmarkTriangleFillIcon
        title='a11y-title'
        fontSize='1.7rem'
        style={{ color: getAlertBackground(type, ColorIndexes.textSubtle) }}
      />
      <div
        style={{ color: getAlertBackground(type, ColorIndexes.textDefault) }}
      >
        Alert text
      </div>
    </div>
  );
};
