import cl from 'clsx/lite';

import type { ThemeMode } from '../../utils/themeUtils';
import { Scale } from '../Scale/Scale';
import { useThemeStore } from '../../store';

import classes from './Scales.module.css';

type ScalesProps = {
  themeMode: ThemeMode;
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
      <div className={classes.row}>
        <div className={classes.scaleLabel}>Neutral</div>
        <Scale
          colorScale={neutralTheme.theme[themeMode]}
          showColorMeta={false}
          themeMode={themeMode}
          type='grey'
        />
      </div>

      <div className={cl(classes.row, classes.brandRow)}>
        <div className={classes.scaleLabel}>Brand 1</div>
        <Scale
          colorScale={brandOneTheme.theme[themeMode]}
          showColorMeta={false}
          themeMode={themeMode}
          type='brandOne'
        />
      </div>
      <div className={classes.row}>
        <div className={classes.scaleLabel}>Brand 2</div>
        <Scale
          colorScale={brandTwoTheme.theme[themeMode]}
          showColorMeta={false}
          themeMode={themeMode}
          type='brandTwo'
        />
      </div>

      <div className={classes.row}>
        <div className={classes.scaleLabel}>Brand 3</div>
        <Scale
          colorScale={brandThreeTheme.theme[themeMode]}
          showColorMeta={false}
          themeMode={themeMode}
          type='brandThree'
        />
      </div>
    </div>
  );
};
