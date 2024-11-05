import type { ColorMode } from '@digdir/designsystemet/color';

import { useThemeStore } from '../../store';
import { Scale } from '../Scale/Scale';

import classes from './Scales.module.css';

type ScalesProps = {
  themeMode: ColorMode;
};

export const Scales = ({ themeMode }: ScalesProps) => {
  const accentTheme = useThemeStore((state) => state.accentTheme);
  const neutralTheme = useThemeStore((state) => state.neutralTheme);
  const brandOneTheme = useThemeStore((state) => state.brandOneTheme);
  const brandTwoTheme = useThemeStore((state) => state.brandTwoTheme);
  const brandThreeTheme = useThemeStore((state) => state.brandThreeTheme);
  return (
    <div className={classes.rows}>
      <div className={classes.row}>
        <div className={classes.scaleLabel}>Accent</div>
        <Scale
          colorScale={accentTheme.theme[themeMode]}
          showHeader
          showColorMeta={false}
          themeMode={themeMode}
          type='accent'
        />
      </div>
    </div>
  );
};
