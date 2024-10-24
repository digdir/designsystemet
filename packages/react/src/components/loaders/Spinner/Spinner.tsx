import cl from 'clsx/lite';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { useSynchronizedAnimation } from '../../../utilities';

export type SpinnerProps = {
  /** Accessibile label  */
  'aria-label': string;
  /**
   * Spinner size
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Spinner appearance
   * @default neutral
   */
  color?: 'neutral' | 'accent';
} & ComponentPropsWithoutRef<'svg'>;

/**  Spinner component used for indicating busy or indeterminate loading */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  function Spinner({
    'aria-label': ariaLabel,
    color = 'neutral',
    size,
    className,
    ...rest
  }: SpinnerProps) {
    const svgRef = useSynchronizedAnimation<SVGSVGElement>(
      'ds-spinner-rotate-animation',
    );

    const strokeRef = useSynchronizedAnimation<SVGCircleElement>(
      'ds-spinner-stroke-animation',
    );

    return (
      <svg
        aria-label={ariaLabel}
        className={cl('ds-spinner', className)}
        data-color={color}
        data-size={size}
        ref={svgRef}
        role='img'
        viewBox='0 0 50 50'
        {...rest}
      >
        <circle
          className={cl('ds-spinner__background')}
          cx='25'
          cy='25'
          r='20'
          fill='none'
          strokeWidth='5'
        />
        <circle
          className={cl(`ds-spinner__circle`)}
          cx='25'
          cy='25'
          r='20'
          fill='none'
          strokeWidth='5'
          ref={strokeRef}
        />
      </svg>
    );
  },
);
