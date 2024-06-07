import type * as React from 'react';
import cl from 'clsx/lite';

import { useSynchronizedAnimation } from '../../hooks';

const sizeMap: {
  [key in NonNullable<SpinnerProps['size']>]: number;
} = {
  '2xs': 13,
  xs: 20,
  sm: 27,
  md: 40,
  lg: 56,
  xl: 79,
};

export type SpinnerProps = {
  /** Spinner title  */
  title: string;
  /**
   * Spinner size
   *
   * @default md
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Spinner appearance
   * @default neutral
   */
  color?: 'neutral' | 'accent';
} & React.ComponentPropsWithoutRef<'svg'>;

/**  Spinner component used for indicating busy or indeterminate loading */
export const Spinner = ({
  title,
  color = 'neutral',
  size = 'md',
  className,
  style,
  ...rest
}: SpinnerProps): JSX.Element => {
  const svgRef = useSynchronizedAnimation<SVGSVGElement>(
    'ds-spinner-rotate-animation',
  );

  const strokeRef = useSynchronizedAnimation<SVGCircleElement>(
    'ds-spinner-stroke-animation',
  );

  return (
    <svg
      className={cl('ds-spinner', `ds-spinner--${color}`, className)}
      style={{ width: sizeMap[size], height: sizeMap[size], ...style }}
      viewBox='0 0 50 50'
      ref={svgRef}
      {...rest}
    >
      <title>{title}</title>
      <circle
        className={cl('ds-spinner__background')}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
      <circle
        className={cl(`ds-spinner__circle`)}
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
