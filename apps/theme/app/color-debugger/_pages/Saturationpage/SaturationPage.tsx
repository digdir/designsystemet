import type { ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import { useDebugStore } from '../../debugStore';
import { ColorIndexes, ColorScaleNames } from '../../utils';
import classes from './SaturationPage.module.css';

type SaturationPageProps = {
  colorScales: ThemeInfo[][];
};

export const SaturationPage = ({ colorScales }: SaturationPageProps) => {
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const luminance = useDebugStore((state) => state.luminance);

  type ItemProps = {
    scale: ThemeInfo;
  };

  const ColorItem = ({ scale }: ItemProps) => {
    const color1 = scale[themeSettings.general.colorScheme][11].hex;
    const color2 = chroma(color1)
      .luminance(luminance[themeSettings.general.colorScheme].borderDefault)
      .hex();
    const color3 = chroma(color1)
      .luminance(luminance[themeSettings.general.colorScheme].surfaceTinted)
      .hex();

    return (
      <div className={classes.colorItem}>
        <div className={classes.row}>
          <div className={classes.itemColumn}>
            <div
              className={classes.itemLeft}
              style={{
                backgroundColor: color1,
              }}
            ></div>
            <div
              className={classes.itemRight}
              style={{
                backgroundColor:
                  scale[themeSettings.general.colorScheme][11].hex,
              }}
            ></div>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.itemColumn}>
            <div
              className={classes.itemLeft}
              style={{
                backgroundColor: color2,
              }}
            ></div>
            <div
              className={classes.itemRight}
              style={{
                backgroundColor:
                  scale[themeSettings.general.colorScheme][
                    ColorIndexes.borderDefault
                  ].hex,
              }}
            ></div>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.itemColumn}>
            <div
              className={classes.itemLeft}
              style={{
                backgroundColor: color3,
              }}
            ></div>
            <div
              className={classes.itemRight}
              style={{
                backgroundColor:
                  scale[themeSettings.general.colorScheme][
                    ColorIndexes.surfaceTinted
                  ].hex,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <div className={classes.heading}>Saturation adjustments</div>
      <div className={classes.items}>
        {colorScales.map((innerScale, index1) => (
          <div key={index1}>
            <div>
              <div className={classes.title}>{ColorScaleNames[index1]}</div>
              <div className={classes.innerItems}>
                {innerScale.map((scale, index2) => (
                  <ColorItem key={index2} scale={scale} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
