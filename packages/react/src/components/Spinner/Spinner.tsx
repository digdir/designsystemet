import React from 'react';
import cn from 'classnames';

import classes from './Spinner.module.css';

const sizeMap: { [key in NonNullable<SpinnerProps['size']>]: number } = {
  xSmall: 13,
  small: 20,
  medium: 27,
  large: 40,
  '1xLarge': 44,
  '2xLarge': 56,
  '3xLarge': 79,
};

export type SpinnerProps = {
  /** Spinner title  */
  title: string;
  /** Spinner size  */
  size?:
    | 'xSmall'
    | 'small'
    | 'medium'
    | 'large'
    | '1xLarge'
    | '2xLarge'
    | '3xLarge';
  /** Spinner appearance  */
  variant?: 'default' | 'interaction' | 'inverted';
} & React.ComponentPropsWithoutRef<'svg'>;

/**  Spinner component used for indicating busy or indeterminate loading */
export const Spinner = ({
  title,
  size = 'medium',
  variant = 'default',
  className,
  ...rest
}: SpinnerProps): JSX.Element => {
  return (
    <svg
      className={cn(classes.spinner, className)}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
      viewBox='0 0 50 50'
      {...rest}
    >
      <title>{title}</title>
      <circle
        className={classes.background}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
      <circle
        className={cn(classes.spinnerCircle, classes[variant])}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
    </svg>
  );
};
