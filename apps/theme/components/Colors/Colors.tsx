import type { ColorMode } from '@digdir/designsystemet/color';

import { useThemeStore } from '../../store';
import { Scale } from '../Scale/Scale';
import classes from './Colors.module.css';

type ScalesProps = {
  themeMode: ColorMode;
};

export const Colors = ({ themeMode }: ScalesProps) => {
  const colors = useThemeStore((state) => state.colors);
  return (
    <div className={classes.rows}>
      {colors.main.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale
            colorScale={color.colors}
            showHeader={index === 0}
            showColorMeta={false}
            themeMode={themeMode}
          />
        </div>
      ))}
      <div className={classes.separator}></div>
      {colors.neutral.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale
            colorScale={color.colors}
            showColorMeta={false}
            themeMode={themeMode}
          />
        </div>
      ))}
      <div className={classes.separator}></div>
      {colors.support.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale
            colorScale={color.colors}
            showColorMeta={false}
            themeMode={themeMode}
          />
        </div>
      ))}
    </div>
  );
};
