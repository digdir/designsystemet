import { RovingFocusItem } from '@digdir/designsystemet-react';
import type { ColorInfo, ThemeColors } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color } from '../Color/Color';

import classes from './Group.module.css';

type GroupProps = {
  header: string;
  colors: ColorInfo[];
  showColorMeta?: boolean;
  names?: string[];
  featured?: boolean;
  type: ThemeColors;
};

export const Group = ({
  header,
  colors,
  showColorMeta,
  names,
  type,
  featured = false,
}: GroupProps) => {
  return (
    <div className={classes.group}>
      {header && (
        <div className={cl(classes.header, featured && classes.featured)}>
          {header}
        </div>
      )}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors, featured && classes.colorsFeatured)}>
        {colors.map((item, index) => (
          <RovingFocusItem key={index} value={item.name} asChild>
            <Color
              color={item}
              colorNumber={5}
              contrast={'dd'}
              lightness={'dd'}
              hex={item.hex}
              showColorMeta={showColorMeta}
              type={type}
            />
          </RovingFocusItem>
        ))}
      </div>
    </div>
  );
};
