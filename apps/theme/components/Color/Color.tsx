import cl from 'clsx/lite';
import { SunIcon } from '@navikt/aksel-icons';

import type { ColorInfoType } from '../../utils/themeUtils';
import { useThemeStore } from '../../store';

import classes from './Color.module.css';

type ColorProps = {
  colorNumber: number;
  color: ColorInfoType;
  contrast?: string;
  lightness?: string;
  featured?: boolean;
  hex?: string;
  showColorMeta?: boolean;
};

const Color = ({
  color,
  contrast,
  featured,
  lightness,
  hex,
  showColorMeta = true,
}: ColorProps) => {
  const setSelectedColor = useThemeStore((state) => state.setSelectedColor);
  return (
    <div>
      <button
        onClick={() => {
          setSelectedColor({
            hex: color.hex,
            number: color.number,
            name: color.name,
          });
        }}
        style={{ backgroundColor: color.hex }}
        className={cl(classes.box, featured && classes.featured)}
      ></button>

      {showColorMeta && (
        <>
          <div className={classes.hex}>{hex}</div>
          <div className={classes.contrast}>
            <div className={classes.colorTest}></div>
            {contrast}
          </div>
          <div className={classes.lightness}>
            <SunIcon
              title='a11y-title'
              fontSize='1.3rem'
            />
            {lightness}
          </div>
        </>
      )}
    </div>
  );
};

export { Color };
