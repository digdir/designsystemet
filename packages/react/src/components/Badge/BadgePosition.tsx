import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
export type BadgePositionProps = MergeRight<
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

/**
 * `BadgePosition` is a component that positions the badge.
 *
 * @example
 * <BadgePosition placement='top-right' overlap='circle'>
 *  <Badge count={5} maxCount={10} />
 *  <Element />
 * </BadgePosition>
 */
export const BadgePosition = forwardRef<HTMLSpanElement, BadgePositionProps>(
  function BadgePlacement(
    { className, overlap = 'rectangle', placement = 'top-right', ...rest },
    ref,
  ) {
    return (
      <span
        className={cl('ds-badge--position', className)}
        data-overlap={overlap}
        data-placement={placement}
        ref={ref}
        {...rest}
      />
    );
  },
);
