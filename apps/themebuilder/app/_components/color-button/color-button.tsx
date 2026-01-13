import type { ColorNames } from '@digdir/designsystemet';
import { Slottable } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import * as R from 'ramda';
import { forwardRef } from 'react';
import classes from './color.module.css';

type ColorButtonProps = {
  colorName: ColorNames;
  color: string;
  featured?: boolean;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'>;

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  ({ color, featured, ...rest }, ref) => {
    return (
      <Slottable>
        <button
          ref={ref}
          style={{ backgroundColor: color }}
          className={cl(classes.box, featured && classes.featured, 'ds-focus')}
          type='button'
          {...R.omit(['colorName'], rest)}
        />
      </Slottable>
    );
  },
);
