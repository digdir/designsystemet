import cl from 'clsx/lite';
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
} from 'react';
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
   * The maximum number to display in the badge, when the count exceeds this number, the badge will display "{max}+"
   */
  maxCount?: number;

  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const paragraphSizeMap: {
  [key in NonNullable<BadgeProps['size']>]: NonNullable<ParagraphProps['size']>;
} = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { color = 'accent', size = 'md', count, maxCount, children, ...props },
    ref,
  ) => {
    const [displayCount, setDisplayCount] = useState(count);

    return (
      <div className='ds-badge__wrapper'>
        <Paragraph asChild variant='short' size={paragraphSizeMap[size]}>
          <span
            {...props}
            className={cl(
              'ds-badge',
              `ds-badge--${size}`,
              count && 'ds-badge--count',
            )}
            ref={ref}
          >
            {count}
          </span>
        </Paragraph>
        {children}
      </div>
    );
  },
);
