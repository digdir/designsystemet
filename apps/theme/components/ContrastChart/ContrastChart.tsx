import {
  type ColorInfo,
  generateThemeForColor,
  getColorNameFromNumber,
  getContrastFromHex,
} from '@/packages/cli/dist/src';

import cl from 'clsx/lite';
import classes from './ContrastChart.module.css';

export const ContrastChart = () => {
  const theme = generateThemeForColor('#0062BA');
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 12, 13];
  const reducedLight = theme.light.filter((color) =>
    [1, 2, 3, 4, 5, 6, 7, 8, 12, 13].includes(color.number),
  );
  const reducedDark = theme.dark.filter((color) =>
    [1, 2, 3, 4, 5, 6, 7, 8, 12, 13].includes(color.number),
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

  const Cell = ({
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
            {getContrastFromHex(color1.hex, color2.hex).toFixed(2)}
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

  return (
    <div>
      <table className={classes.table}>
        <tr>
          <th></th>
          {reducedLight.map((color, index) => (
            <ThCell key={index} color={reducedLight[index]} />
          ))}
        </tr>

        {numbers.map((number, index) => (
          <tr key={index}>
            <ThCell color={reducedLight[index]} />
            {reducedLight.map((color, index) => (
              <td key={index} className={classes.td}>
                <Cell color1={color} color2={theme.light[number - 1]} />
              </td>
            ))}
          </tr>
        ))}
      </table>
      <table
        className={cl(classes.table, classes.tableDark)}
        data-ds-color-mode='dark'
      >
        <tr>
          <th></th>
          {reducedDark.map((color, index) => (
            <ThCell key={index} color={reducedDark[index]} />
          ))}
        </tr>

        {numbers.map((number, index) => (
          <tr key={index}>
            <ThCell color={reducedDark[index]} />
            {reducedDark.map((color, index) => (
              <td key={index} className={classes.td}>
                <Cell color1={color} color2={theme.dark[number - 1]} />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};
