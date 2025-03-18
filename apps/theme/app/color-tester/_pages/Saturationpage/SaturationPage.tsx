import type { ThemeInfo } from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import { useDebugStore } from '../../debugStore';
import { ColorIndexes } from '../../utils';
import classes from './SaturationPage.module.css';

type SaturationPageProps = {
  colorScales: {
    [key: string]: {
      low: ThemeInfo[];
      medium: ThemeInfo[];
      high: ThemeInfo[];
      veryHigh: ThemeInfo[];
    };
  };
};

export const SaturationPage = ({ colorScales }: SaturationPageProps) => {
  const themeSettings = useDebugStore((state) => state.themeSettings);

  type ItemProps = {
    scale: ThemeInfo;
  };

  const getOKLCH = (hex: string) => {
    const [l, c, h] = chroma(hex).oklch();
    return (
      'L ' + l.toFixed(2) + ' C ' + c.toFixed(2) + ' H ' + h.toFixed(2) + ''
    );
  };

  const ColorItem = ({ scale }: ItemProps) => {
    const colorTheme = scale[themeSettings.general.colorScheme];
    const baseDefault = colorTheme[ColorIndexes.baseDefault].hex;
    const lightBaseDefault = scale.light[ColorIndexes.baseDefault].hex;
    const surfaceTinted = colorTheme[ColorIndexes.surfaceTinted].hex;
    const surfaceDefault = colorTheme[ColorIndexes.surfaceDefault].hex;
    const backgroundTinted = colorTheme[ColorIndexes.backgroundTinted].hex;
    const borderSubtle = colorTheme[ColorIndexes.borderSubtle].hex;
    const contrastBaseDefault =
      colorTheme[ColorIndexes.baseContrastDefault].hex;

    return (
      <div className={classes.colorItem}>
        <div className={classes.metaContainer}>
          <div
            className={classes.circle}
            style={{ backgroundColor: lightBaseDefault }}
          ></div>
          <div
            className={classes.metaText}
            style={{
              color:
                themeSettings.general.colorScheme === 'dark'
                  ? '#ffffff'
                  : '#000000',
            }}
          >
            {getOKLCH(lightBaseDefault)}
          </div>
        </div>

        <div
          className={classes.colorItemInner}
          style={{ backgroundColor: backgroundTinted }}
        >
          <div
            className={classes.test}
            style={{ backgroundColor: surfaceTinted }}
          >
            <div
              className={classes.btn}
              style={{
                backgroundColor: baseDefault,
                color: contrastBaseDefault,
              }}
            >
              Button
            </div>
          </div>
          <div
            className={classes.footer}
            style={{ backgroundColor: surfaceTinted }}
          >
            <div
              className={classes.footerItem}
              style={{ backgroundColor: borderSubtle }}
            ></div>
            <div
              className={classes.footerItem}
              style={{ backgroundColor: borderSubtle }}
            ></div>
            <div
              className={classes.footerItem}
              style={{ backgroundColor: borderSubtle }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const Group = ({ scales, title }: { scales: ThemeInfo[]; title: string }) => {
    if (scales.length === 0) {
      return null;
    }

    return (
      <div
        className={classes.saturationGroup}
        style={{
          backgroundColor:
            themeSettings.general.colorScheme === 'dark' ? '#000000' : '#fff',
        }}
      >
        <div
          className={classes.saturationHeading}
          style={{
            color:
              themeSettings.general.colorScheme === 'dark'
                ? '#ffffff'
                : '#000000',
          }}
        >
          {title}
        </div>
        <div className={classes.saturationItems}>
          {scales.map((scale) => (
            <ColorItem
              key={scale[themeSettings.general.colorScheme][11].hex}
              scale={scale}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <div className={classes.heading}>Saturation adjustments</div>
      <div className={classes.items}>
        <div className={classes.innerItems}>
          {Object.entries(colorScales).map(([key, value]) => (
            <div key={key} className={classes.item}>
              <div className={classes.itemTitle}>{key}</div>
              <div className={classes.scales}>
                <Group
                  scales={value.low}
                  title='Low saturation:  < 0.8 chroma'
                />
                <Group
                  scales={value.medium}
                  title='Medium saturation: < 1.5 chroma'
                />
                <Group
                  scales={value.high}
                  title='High saturation: > 2.1 chroma'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
