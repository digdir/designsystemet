import type { ThemeInfo } from '@/packages/cli/dist/src';
import { Checkbox, Heading } from '@digdir/designsystemet-react';
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

type ColorTablesProps = {
  colorScales: ThemeInfo[][];
};

export const ColorTables = ({ colorScales }: ColorTablesProps) => {
  return (
    <div className={classes.tables}>
      <div className={classes.pageHeading}>Color tables</div>
      <div className={classes.table}>
        <Heading className={classes.heading}>Background tinted</Heading>
        <ColorGrid colors={colorScales} colorNumber={1} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Surface Default</Heading>
        <ColorGrid colors={colorScales} colorNumber={2} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Surface tinted</Heading>
        <ColorGrid colors={colorScales} colorNumber={3} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Surface hover</Heading>
        <ColorGrid colors={colorScales} colorNumber={4} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Surface Active</Heading>
        <ColorGrid colors={colorScales} colorNumber={5} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Border Subtle</Heading>
        <ColorGrid colors={colorScales} colorNumber={6} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Border Default</Heading>
        <ColorGrid colors={colorScales} colorNumber={7} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Border Strong</Heading>
        <ColorGrid colors={colorScales} colorNumber={8} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Text Subtle</Heading>
        <ColorGrid colors={colorScales} colorNumber={9} />
      </div>

      <div className={classes.table}>
        <Heading className={classes.heading}>Text Default</Heading>
        <ColorGrid colors={colorScales} colorNumber={10} />
      </div>
    </div>
  );
};
