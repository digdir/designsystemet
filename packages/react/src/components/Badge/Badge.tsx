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
      color = 'accent',
      size = 'md',
      placement = 'top-right',
      overlap = 'rectangle',
      count,
      maxCount,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={cl('ds-badge__wrapper', className)}>
        {children}
        <Paragraph asChild variant='short' size={paragraphSizeMap[size]}>
          <span
            className={cl('ds-badge', count && 'ds-badge--count')}
            ref={ref}
            data-size={size}
            data-color={color}
            {...(children
              ? {
                  'data-placement': placement,
                  'data-overlap': overlap,
                }
              : {})}
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
