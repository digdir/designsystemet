import type * as React from 'react';
import cl from 'clsx';

import { useSynchronizedAnimation } from '../../hooks';

import classes from './Spinner.module.css';

const sizeMap: { [key in NonNullable<SpinnerProps['size']>]: number } = {
  xxsmall: 13,
  xsmall: 20,
  small: 27,
  medium: 40,
  large: 56,
  xlarge: 79,
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
  style,
  ...rest
}: SpinnerProps): JSX.Element => {
  const svgRef = useSynchronizedAnimation<SVGSVGElement>(
    classes['rotate-animation'],
  );

  const strokeRef = useSynchronizedAnimation<SVGCircleElement>(
    classes['stroke-animation'],
  );

  return (
    <svg
      className={cl(classes.spinner, className)}
      style={{ width: sizeMap[size], height: sizeMap[size], ...style }}
      viewBox='0 0 50 50'
      ref={svgRef}
      {...rest}
    >
      <title>{title}</title>
      <circle
        className={cl(
          classes.background,
          variant === 'inverted' && classes.invertedBackground,
        )}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
      <circle
        className={cl(classes.spinnerCircle, classes[variant])}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
        ref={strokeRef}
      ></circle>
    </svg>
  );
};

Spinner.displayName = 'Spinner';
