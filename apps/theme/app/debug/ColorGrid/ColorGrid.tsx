import type { ThemeInfo } from '@/packages/cli/dist/src';
import classes from './ColorGrid.module.css';
type ColorGridProps = {
  colors: ThemeInfo[][];
  showBase?: boolean;
  colorNumber: number;
};

type RowProps = {
  rowColors: ThemeInfo[];
};

export const ColorGrid = ({
  colors,
  showBase = false,
  colorNumber,
}: ColorGridProps) => {
  const Row = ({ rowColors }: RowProps) => {
    return (
      <div className={classes.row}>
        {rowColors.map((rowItem, index) => (
          <div key={index} className={classes.item}>
            {showBase && (
              <div
                className={classes.baseColor}
                style={{ backgroundColor: rowItem.light[8].hex }}
              ></div>
            )}
            <div
              className={classes.color}
              style={{ backgroundColor: rowItem.light[colorNumber].hex }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={classes.rows}>
      {colors.map((item, index) => (
        <Row key={index} rowColors={item} />
      ))}
    </div>
  );
};
