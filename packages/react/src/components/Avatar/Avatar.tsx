import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import {
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useMemo,
} from 'react';

export type AvatarProps = {
  /**
   * The name of the person the avatar represents.
   * Will be used to generate initials if no image is provided.
   */
  name?: string;
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
   * Image or icon to display inside the avatar.
   *
   * Gets `aria-hidden="true"`
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const fontSizeMap = {
  xs: 'ds-paragraph--xs',
  sm: 'ds-heading--2xs',
  md: 'ds-heading--sm',
  lg: 'ds-heading--md',
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    name,
    color = 'accent',
    size = 'md',
    variant = 'circle',
    className,
    children,
    ...rest
  },
  ref,
) {
  const Component = children ? Slot : Fragment;

  const initials = useMemo(() => {
    return getInitials(name);
  }, [name]);

  return (
    <span
      ref={ref}
      className={cl(
        'ds-avatar',
        `ds-avatar--${variant}`,
        `ds-avatar--${color}`,
        `ds-avatar--${size}`,
        fontSizeMap[size],
        className,
      )}
      {...rest}
      role='img'
      aria-label={name}
    >
      <Component {...(children ? { 'aria-hidden': true } : {})}>
        {children || initials}
      </Component>
    </span>
  );
});

/**
 * Gets initials using first and last word of a name.
 *
 * @param name
 * @returns
 */
function getInitials(name: string | undefined): string | null {
  if (!name) return null;

  const splitName = name.trim().split(' ');

  return `${splitName[0][0]}${splitName.length > 1 ? splitName[splitName.length - 1][0] : ''}`.toUpperCase();
}