import cl from 'clsx/lite';

import { Color } from '../Color/Color';
import type { ColorInfoType } from '../../utils/themeUtils';

import classes from './Group.module.css';

type GroupProps = {
  header: string;
  colors: ColorInfoType[];
  showColorMeta?: boolean;
  names?: string[];
  featured?: boolean;
};

export const Group = ({
  header,
  colors,
  showColorMeta,
  names,

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
        {colors.map(function (item, index) {
          return (
            <Color
              key={index}
              color={item}
              colorNumber={5}
              contrast={'dd'}
              lightness={'dd'}
              hex={item.hex}
              showColorMeta={showColorMeta}
            />
          );
        })}
      </div>
    </div>
  );
};
