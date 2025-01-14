import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useDebugStore } from '../debugStore';
import classes from './Scales.module.css';

export const Scales = () => {
  const colorScales = useDebugStore((state) => state.colorScales);

  type ScaleProps = {
    scale: ThemeInfo;
  };

  const Scale = ({ scale }) => {
    return (
      <div className={classes.scale}>
        {scale.light.map((color, index) => (
          <div
            className={classes.color}
            key={index}
            style={{ backgroundColor: color.hex }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {colorScales.map((innerScales, index) => (
        <div key={index} className={classes.scales}>
          {innerScales.map((scale, index) => (
            <Scale key={index} scale={scale} />
          ))}
        </div>
      ))}
    </div>
  );
};
