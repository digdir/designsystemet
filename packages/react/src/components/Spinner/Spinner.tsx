import type * as React from 'react';
import cl from 'clsx/lite';

import { useSynchronizedAnimation } from '../../hooks';
import { getSize } from '../../utilities/getSize';

type OldSpinnerSizes =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

const sizeMap: {
  [key in Exclude<NonNullable<SpinnerProps['size']>, OldSpinnerSizes>]: number;
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
   * @note `xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge` is deprecated
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | OldSpinnerSizes;
  /** Spinner appearance  */
  variant?: 'default' | 'interaction' | 'inverted';
} & React.ComponentPropsWithoutRef<'svg'>;

/**  Spinner component used for indicating busy or indeterminate loading */
export const Spinner = ({
  title,
  variant = 'default',
  className,
  style,
  ...rest
}: SpinnerProps): JSX.Element => {
  const size = getSize(rest.size || 'md') as
    | '2xs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl';

  const svgRef = useSynchronizedAnimation<SVGSVGElement>(
    'fds-spinner-rotate-animation',
  );

  const strokeRef = useSynchronizedAnimation<SVGCircleElement>(
    'fds-spinner-stroke-animation',
  );

  return (
    <svg
      className={cl('fds-spinner', `fds-spinner--${variant}`, className)}
      style={{ width: sizeMap[size], height: sizeMap[size], ...style }}
      viewBox='0 0 50 50'
      ref={svgRef}
      {...rest}
    >
      <title>{title}</title>
      <circle
        className={cl(
          'fds-spinner__background',
          variant === 'inverted' && 'fds-spinner__background--inverted',
        )}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      ></circle>
      <circle
        className={cl(`fds-spinner__circle`)}
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
