import cl from 'clsx/lite';
import type { ButtonHTMLAttributes } from 'react';
import classes from './color-button.module.css';

type ColorButtonProps = {
  color: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

/** A button that shows a colour */
export const ColorButton = ({ color, ...rest }: ColorButtonProps) => (
  <button
    style={{ backgroundColor: color }}
    className={cl(classes.swatch, 'ds-focus')}
    type='button'
    {...rest}
  />
);
