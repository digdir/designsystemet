import React from 'react';

import classes from './Spinner.module.css';

type Size =
  | 'xSmall'
  | 'small'
  | 'medium'
  | 'large'
  | '1xLarge'
  | '2xLarge'
  | '3xLarge';

type Variant = 'default' | 'interaction' | 'inverted';

const sizeMap: Record<Size, number> = {
  xSmall: 13,
  small: 20,
  medium: 27,
  large: 40,
  '1xLarge': 44,
  '2xLarge': 56,
  '3xLarge': 79,
};

const variantMap: Record<Variant, { foreground: string; background: string }> =
  {
    default: {
      foreground: classes.defaultForeground,
      background: classes.defaultBackground,
    },
    interaction: {
      foreground: classes.interactionForeground,
      background: classes.interactionBackground,
    },
    inverted: {
      foreground: classes.invertedForeground,
      background: classes.invertedBackground,
    },
  };

export type SpinnerProps = {
  /** Spinner title  */
  title?: string;
  /** Spinner size  */
  size?: Size;
  /** Spinner appearance  */
  variant?: Variant;
} & React.ComponentPropsWithoutRef<'svg'>;

/**  Spinner component used for indicating busy or indeterminate loading */
export const Spinner = ({
  title,
  size = 'medium',
  variant = 'default',
  className = '',
  ...rest
}: SpinnerProps): JSX.Element => {
  return (
    <svg
      className={`${classes.spinner} ${className}`}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
      viewBox='0 0 50 50'
      {...rest}
    >
      <title>{title}</title>
      <circle
        className={variantMap[variant].background}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
      <circle
        className={`${classes.spinnerCircle} ${variantMap[variant].foreground}`}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
    </svg>
  );
};
