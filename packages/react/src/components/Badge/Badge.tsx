import cl from 'clsx/lite';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Paragraph, type ParagraphProps } from '../Typography';

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
  placement?:
    | 'right top'
    | 'left top'
    | 'right bottom'
    | 'left bottom'
    | (CSSStyleDeclaration['backgroundPosition'] & {}); // For better IntelliSense - see https://stackoverflow.com/a/61048124
  /**
   * The badge will float on top of the children
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const paragraphSizeMap: {
  [key in NonNullable<BadgeProps['size']>]: NonNullable<ParagraphProps['size']>;
} = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

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
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      color = 'accent',
      count,
      maxCount,
      placement = 'top right',
      size = 'md',
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={cl('ds-badge__wrapper', className)}>
        {children}
        <Paragraph asChild variant='short' size={paragraphSizeMap[size]}>
          <span
            className={cl(
              'ds-badge',
              `ds-badge--${size}`,
              `ds-badge--${color}`,
              count && 'ds-badge--count',
              children && 'ds-badge--float',
            )}
            style={
              children ? { ...parsePlacement(placement), ...style } : style
            }
            ref={ref}
            {...rest}
          >
            {maxCount && count && count > maxCount ? `${maxCount}+` : count}
          </span>
        </Paragraph>
      </div>
    );
  },
);

Badge.displayName = 'Badge';

function parsePlacement(placement: BadgeProps['placement']) {
  const parts = placement?.toLowerCase().split(/[\s-]+/) || [];
  let [left = '100%', top = '0%'] = parts;

  if (parts.includes('bottom')) top = '100%';
  if (parts.includes('left')) left = '0%';
  if (parts.includes('right')) left = '100%';
  if (parts.includes('top')) top = '0%';

  return { left, top };
}
