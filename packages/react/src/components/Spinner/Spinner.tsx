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

type SpinnerProps = {
  screenReaderLabel: string;
  size?: Size;
  variant?: Variant;
};
export const Spinner = ({
  screenReaderLabel,
  size = 'medium',
  variant = 'default',
}: SpinnerProps): JSX.Element => {
  const sizeMap: Record<Size, number> = {
    xSmall: 13,
    small: 20,
    medium: 27,
    large: 40,
    '1xLarge': 44,
    '2xLarge': 56,
    '3xLarge': 79,
  };

  const variantMap: Record<
    Variant,
    { foreground: string; background: string }
  > = {
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

  return (
    <div
      data-testid='spinner-container'
      aria-busy={true}
      aria-live='polite'
    >
      <svg
        className={classes.spinner}
        style={{ width: sizeMap[size], height: sizeMap[size] }}
        viewBox='0 0 50 50'
      >
        <title>{screenReaderLabel}</title>
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
    </div>
  );
};
