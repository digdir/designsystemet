import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useDebugStore } from '../../../debugStore';
import { ColorIndexes } from '../../../utils';
import classes from './Alert.module.css';

type AlertProps = {
  type: 'success' | 'warning' | 'info' | 'error';
};

export const Alert = ({ type }: AlertProps) => {
  const luminance = useDebugStore((state) => state.luminance);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const colorScales = useDebugStore((state) => state.colorScales);

  const getAlertBackground = (
    type: 'success' | 'warning' | 'info' | 'error',
    index: number,
  ) => {
    const colorSchemes = {
      success: colorScales[12][0],
      info: colorScales[12][3],
      error: colorScales[12][1],
      warning: colorScales[12][2],
    };

    return colorSchemes[type][themeSettings.general.colorScheme][index].hex;
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
