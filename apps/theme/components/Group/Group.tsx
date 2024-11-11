import { RovingFocusItem } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color } from '../Color/Color';

import classes from './Group.module.css';

type GroupProps = {
  header: string;
  colors: number[];
  colorScale: ThemeInfo;
  showColorMeta?: boolean;
  names?: string[];
  featured?: boolean;
};

export const Group = ({
  header,
  colors,
  showColorMeta,
  names,
  colorScale,
  featured = false,
}: GroupProps) => {
  return (
    <div className={classes.group}>
      {header && <div className={cl(classes.header)}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors)}>
        {colors.map((item, index) => (
          <RovingFocusItem key={index} value={'3'} asChild>
            <Color
              color={colorScale.light[item].hex}
              colorNumber={item}
              contrast={'dd'}
              lightness={'dd'}
              showColorMeta={showColorMeta}
              name='33'
            />
          </RovingFocusItem>
        ))}
      </div>
    </div>
  );
};
