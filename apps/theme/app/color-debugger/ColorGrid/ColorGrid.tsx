import type { ThemeInfo } from '@/packages/cli/dist/src';
import { Checkbox } from '@digdir/designsystemet-react';
import { useState } from 'react';
import { useDebugStore } from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import { ColorIndexes } from '../utils';
import classes from './ColorGrid.module.css';
type ColorGridProps = {
  colors: ThemeInfo[][];
  showBase?: boolean;
  colorNumber: number;
};

type RowProps = {
  rowColors: ThemeInfo[];
};

export const ColorGrid = ({ colors, colorNumber }: ColorGridProps) => {
  const [showBase, setShowBase] = useState(false);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const luminance = useDebugStore((state) => state.luminance);
  const greyScheme = generateColorSchemes('#000000', luminance, themeSettings);

  const Row = ({ rowColors }: RowProps) => {
    return (
      <div className={classes.row}>
        {rowColors.map((rowItem, index) => (
          <div key={index} className={classes.item}>
            {showBase && (
              <div
                className={classes.baseColor}
                style={{
                  backgroundColor:
                    rowItem[themeSettings.general.colorScheme][
                      ColorIndexes.baseDefault
                    ].hex,
                }}
              ></div>
            )}
            <div
              className={classes.color}
              style={{
                backgroundColor:
                  rowItem[themeSettings.general.colorScheme][colorNumber].hex,
                borderColor:
                  greyScheme[themeSettings.general.colorScheme][
                    ColorIndexes.backgroundDefault
                  ].hex,
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={classes.rows}>
      <Checkbox
        label='Show base colors'
        data-size='sm'
        onChange={(e) => setShowBase(e.target.checked)}
        className={classes.checkbox}
      />
      <div
        className={classes.grid}
        style={{
          backgroundColor:
            greyScheme[themeSettings.general.colorScheme][
              ColorIndexes.backgroundDefault
            ].hex,
        }}
      >
        {colors.map((item, index) => (
          <Row key={index} rowColors={item} />
        ))}
      </div>
    </div>
  );
};
