import { omit } from '@digdir/designsystemet-react';
import { Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { ColorNames } from '@/packages/cli/dist/src';
import classes from './Color.module.css';

type ColorProps = {
  colorName: ColorNames;
  color: string;
  featured?: boolean;
  showColorMeta?: boolean;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'>;

export const Color = forwardRef<HTMLButtonElement, ColorProps>(
  ({ color, featured, showColorMeta = true, ...rest }, ref) => {
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
            {...omit(['colorName'], rest)}
          />
        </Slottable>
      </>
    );
  },
);
