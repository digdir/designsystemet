import type { CssColor } from '@adobe/leonardo-contrast-colors';
import cl from 'clsx/lite';

import { Color } from '../Color/Color';

import classes from './Group.module.css';

type GroupProps = {
  header: string;
  colors: CssColor[];
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
        <div className={cl(classes.header, { [classes.featured]: featured })}>
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
      <div
        className={cl(classes.colors, { [classes.colorsFeatured]: featured })}
      >
        {colors.map(function (item, index) {
          return (
            <Color
              key={index}
              color={item}
              contrast={'dd'}
              lightness={'dd'}
              hex={item}
              showColorMeta={showColorMeta}
            />
          );
        })}
      </div>
    </div>
  );
};
