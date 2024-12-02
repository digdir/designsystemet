import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
export type BadgePlacementProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * The placement of the badge
     *
     * @default top-right
     */
    placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /**
     * Use when badge is floating to change the position of the badge
     *
     * @default rectangle
     */
    overlap?: 'circle' | 'rectangle';
  }
>;

export const BadgePlacement = forwardRef<HTMLSpanElement, BadgePlacementProps>(
  function BadgePlacement(
    { className, overlap = 'rectangle', placement = 'top-right', ...rest },
    ref,
  ) {
    return (
      <span
        className={cl('ds-badge--placement', className)}
        data-overlap={overlap}
        data-placement={placement}
        ref={ref}
        {...rest}
      />
    );
  },
);
