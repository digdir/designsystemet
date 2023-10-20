import React from 'react';
import cn from 'classnames';

import classes from './Spinner.module.css';

const baseSize = 54;
const modifier = 1.13;

const sizeMap: { [key in NonNullable<SpinnerProps['size']>]: number } = {
  xxsmall: baseSize * Math.pow(modifier, 0),
  xsmall: baseSize * Math.pow(modifier, 1),
  small: baseSize * Math.pow(modifier, 2),
  medium: baseSize * Math.pow(modifier, 3),
  large: baseSize * Math.pow(modifier, 4),
  xlarge: baseSize * Math.pow(modifier, 5),
};

export type SpinnerProps = {
  /** Spinner title  */
  title: string;
  /** Spinner size  */
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
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
