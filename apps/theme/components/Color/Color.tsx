import { omit } from '@digdir/designsystemet-react';
import { SunIcon } from '@navikt/aksel-icons';
import { Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';
import { useThemeStore } from '../../store';

import classes from './Color.module.css';

type ColorProps = {
  colorNumber: number;
  color: string;
  contrast?: string;
  lightness?: string;
  featured?: boolean;
  showColorMeta?: boolean;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'>;

const Color = forwardRef<HTMLButtonElement, ColorProps>(
  (
    { color, contrast, featured, lightness, showColorMeta = true, ...rest },
    ref,
  ) => {
    const setSelectedColor = useThemeStore((state) => state.setSelectedColor);
    return (
      <>
        <Slottable>
          <button
            ref={ref}
            style={{ backgroundColor: color }}
            className={cl(
              classes.box,
              featured && classes.featured,
              'ds-focus',
            )}
            type='button'
            {...omit(['colorNumber'], rest)}
          ></button>
        </Slottable>

        {showColorMeta && (
          <>
            <div className={classes.contrast}>
              <div className={classes.colorTest}></div>
              {contrast}
            </div>
            <div className={classes.lightness}>
              <SunIcon title='a11y-title' fontSize='1.3rem' />
              {lightness}
            </div>
          </>
        )}
      </>
    );
  },
);

export { Color };
