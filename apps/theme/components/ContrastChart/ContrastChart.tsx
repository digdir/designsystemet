import {
  type ColorInfo,
  generateThemeForColor,
  getColorNameFromNumber,
  getContrastFromHex,
} from '@/packages/cli/dist/src';

import cl from 'clsx/lite';
import classes from './ContrastChart.module.css';

type ContrastChartProps = {
  type?: 'light' | 'dark';
};

export const ContrastChart = ({ type = 'light' }: ContrastChartProps) => {
  const theme = generateThemeForColor('#0062BA');
  const includedColorIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 12, 13];
  const reducedLight = theme.light.filter((color) =>
    includedColorIndexes.includes(color.number),
  );
  const reducedDark = theme.dark.filter((color) =>
    includedColorIndexes.includes(color.number),
  );

  const Tag = ({
    color1,
    color2,
  }: { color1: ColorInfo; color2: ColorInfo }) => {
    const contrast = getContrastFromHex(color1.hex, color2.hex);
    let type = 'AAA';

    if (contrast < 3) {
      type = 'FAIL';
    } else if (contrast < 4.5) {
      type = 'AA18';
    } else if (contrast < 7) {
      type = 'AA';
    }

    return <div className={cl(classes.tag, classes[type])}>{type}</div>;
  };

  const TdCell = ({
    color1,
    color2,
  }: { color1: ColorInfo; color2: ColorInfo }) => {
    return (
      <div className={classes.cell}>
        <div className={classes.colors}>
          <div
            className={classes.color}
            style={{ backgroundColor: color2.hex }}
          ></div>
          <div
            className={classes.color}
            style={{ backgroundColor: color1.hex }}
          ></div>
        </div>
        <div className={classes.meta}>
          <Tag color1={color1} color2={color2} />
          <div className={classes.contrast}>
            {Math.floor(getContrastFromHex(color1.hex, color2.hex) * 10) / 10}
            :1
          </div>
        </div>
      </div>
    );
  };

  const ThCell = ({ color }: { color: ColorInfo }) => {
    return (
      <th className={classes.th}>
        <div className={classes.header}>
          {getColorNameFromNumber(color.number)}
          <div className={classes.headerHex}>{color.hex}</div>
        </div>
      </th>
    );
  };

  const reducedColors = type === 'light' ? reducedLight : reducedDark;
  const themeColors = type === 'light' ? theme.light : theme.dark;

  return (
    <div data-ds-color-mode={type} className={classes.contrastChart}>
      <table className={classes.table}>
        <tr>
          <th />
          {reducedColors.map((color, index) => (
            <ThCell key={index} color={reducedColors[index]} />
          ))}
        </tr>

        {includedColorIndexes.map((number, index) => (
          <tr key={index}>
            <ThCell color={reducedColors[index]} />
            {reducedColors.map((color, index) => (
              <td key={index} className={classes.td}>
                <TdCell color1={color} color2={themeColors[number - 1]} />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};
