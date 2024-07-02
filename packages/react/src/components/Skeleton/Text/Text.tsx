import type { HTMLAttributes } from 'react';
import cl from 'clsx/lite';

import { useSynchronizedAnimation } from '../../../utilities';

export type TextProps = {
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of text */
export const Text = ({
  width,
  height,
  className,
  style,
  children,
  ...rest
}: TextProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>(
    'ds-skeleton-opacity-fade',
  );

  return (
    <div
      ref={ref}
      className={cl(
        'ds-skeleton',
        'ds-skeleton--text',
        Boolean(children) && 'ds-skeleton--has-children',
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden
      {...rest}
    >
      {children}
    </div>
  );
};

Text.displayName = 'SkeletonText';
