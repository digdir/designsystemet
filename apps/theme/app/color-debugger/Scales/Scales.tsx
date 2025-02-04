import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useDebugStore } from '../debugStore';
import { ColorScaleNames } from '../utils';
import classes from './Scales.module.css';

export const Scales = () => {
  const colorScales = useDebugStore((state) => state.colorScales);
  const themeSettings = useDebugStore((state) => state.themeSettings);

  type ScaleProps = {
    scale: ThemeInfo;
  };

  const Scale = ({ scale }: ScaleProps) => {
    return (
      <div className={classes.scale}>
        {scale[themeSettings.general.colorScheme].map(
          (color: { hex: string }, index: number) => (
            <div
              className={classes.color}
              key={index}
              style={{ backgroundColor: color.hex }}
            ></div>
          ),
        )}
      </div>
    );
  };

  return (
    <div>
      {colorScales.map((innerScales, index) => (
        <div key={index} className={classes.scales}>
          <div className={classes.title}>{ColorScaleNames[index]}</div>
          {innerScales.map((scale, index) => (
            <Scale key={index} scale={scale} />
          ))}
        </div>
      ))}
    </div>
  );
};
