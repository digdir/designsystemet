import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import {
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

export type AvatarProps = {
  /**
   * The name of the person the avatar represents.
   */
  'aria-label': string;
  /**
   * The color of the avatar.
   *
   * @default 'accent'
   */
  color?: 'accent' | 'neutral' | 'brand1' | 'brand2' | 'brand3';
  /**
   * The size of the avatar.
   *
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * The shape of the avatar.
   *
   * @default 'circle'
   */
  variant?: 'circle' | 'square';
  /**
   * Image, icon or initials to display inside the avatar.
   *
   * Gets `aria-hidden="true"`
   */
  children?: ReactNode;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'aria-label'>;

const fontSizeMap = {
  xs: 'ds-paragraph--xs',
  sm: 'ds-heading--2xs',
  md: 'ds-heading--sm',
  lg: 'ds-heading--md',
};

/**
 * Avatars are used to represent people or entities.
 *
 * @example
 * <Avatar aria-label="John Doe">JD</Avatar>
 *
 * @example
 * <Avatar aria-label="John Doe">
 *  <img src='…' alt='John Doe' />
 * </Avatar>
 *
 * @example
 * <Avatar aria-label="John Doe">
 *  <Icon />
 * </Avatar>
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    'aria-label': ariaLabel,
    color = 'accent',
    size = 'md',
    variant = 'circle',
    className,
    children,
    ...rest
  },
  ref,
) {
  const Component = children && typeof children !== 'string' ? Slot : Fragment;

  return (
    <span
      ref={ref}
      className={cl('ds-avatar', fontSizeMap[size], className)}
      data-ds-variant={variant}
      data-ds-color={color}
      data-ds-size={size}
      role='img'
      aria-label={ariaLabel}
      {...rest}
    >
      <Component {...(children ? { 'aria-hidden': true } : {})}>
        {children}
      </Component>
    </span>
  );
});

/**
 * Gets initials using first and last word of a name.
 */
function getInitials(name: string | undefined): string | null {
  // Leaving this function for perhaps later use
  if (!name) return null;
  const initials = [];
  const segments = new Intl.Segmenter(document.documentElement.lang || 'no', {
    granularity: 'word',
  }).segment(name);
  for (const segment of segments)
    if (segment.isWordLike) initials.push(segment.segment);
  return `${initials[0][0]}${initials.length > 1 ? initials[initials.length - 1][0] : ''}`;
}