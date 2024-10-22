import cl from 'clsx/lite';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

export type BadgeProps = {
  /**
   * The color of the badge
   *
   * @default accent
   */
  color?: 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  /**
   * The size of the badge
   *
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The number to display in the badge
   */
  count?: number;
  /**
   * The maximum number to display in the badge, when the count exceeds this number, the badge will display `{max}+`
   */
  maxCount?: number;
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
  /**
   * The badge will float on top of the children
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * `Badge` is a non-interactive component for displaying status with or without numbers.
 *
 * @example without children
 * ```jsx
 * <Badge color='accent' size='md' count={5} />
 * ```
 *
 * @example with children
 * ```jsx
 * <Badge color='accent' size='md'>
 *  <Icon />
 * </Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    color = 'accent',
    count,
    maxCount,
    overlap = 'rectangle',
    placement = 'top-right',
    size,
    ...rest
  },
  ref,
) {
  return (
    <span
      className={cl('ds-badge', className)}
      data-color={color}
      data-count={
        count && maxCount && count > maxCount ? `${maxCount}+` : count
      }
      data-overlap={rest.children ? overlap : null}
      data-placement={rest.children ? placement : null}
      data-size={size}
      ref={ref}
      {...rest}
    />
  );
});
