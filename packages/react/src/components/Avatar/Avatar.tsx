import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { Fragment, forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import type { DefaultProps, Size } from '../../types';
import type { MergeRight } from '../../utilities';

export type AvatarProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * The name of the person the avatar represents.
     */
    'aria-label': string;
    /**
     * The size of the avatar.
     */
    'data-size'?: 'xs' | Size;
    /**
     * The shape of the avatar.
     *
     * @default 'circle'
     */
    variant?: 'circle' | 'square';
    /**
     * Initials to display inside the avatar.
     */
    initials?: string;
    /**
     * Image, icon or initials to display inside the avatar.
     *
     * Gets `aria-hidden="true"`
     */
    children?: ReactNode;
  }
>;

/**
 * Avatars are used to represent people or entities.
 *
 * @example
 * <Avatar aria-label="John Doe" initials="JD" />
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
    variant = 'circle',
    className,
    children,
    initials,
    ...rest
  },
  ref,
) {
  const useSlot = children && typeof children !== 'string';
  const Component = useSlot ? Slot : Fragment;

  return (
    <span
      ref={ref}
      className={cl('ds-avatar', className)}
      data-variant={variant}
      data-initials={initials}
      role='img'
      aria-label={ariaLabel}
      {...rest}
    >
      <Component {...(useSlot ? { 'aria-hidden': true } : {})}>
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
