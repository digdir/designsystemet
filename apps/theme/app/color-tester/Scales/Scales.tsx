import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useState } from 'react';
import { ColorFilter } from '../ColorFilter/ColorFilter';
import { useDebugStore } from '../debugStore';
import { ColorScaleNames } from '../utils';
import classes from './Scales.module.css';

export const Scales = () => {
  const colorScales = useDebugStore((state) => state.colorScales);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const [activeColor, setActiveColor] = useState('Alle');

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
      <div className={classes.heading}>Color scales</div>
      <ColorFilter onFilterChange={(e) => setActiveColor(e)} />
      {colorScales.map((innerScales, index) => (
        <div key={index}>
          {(ColorScaleNames[index] === activeColor ||
            activeColor === 'Alle') && (
            <div className={classes.scales}>
              <div className={classes.title}>{ColorScaleNames[index]}</div>
              {innerScales.map((scale, index) => (
                <Scale key={index} scale={scale} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
