import { PersonIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useMemo } from 'react';

export type AvatarProps = {
  /**
   * The name of the person the avatar represents.
   * Will be used to generate initials if no image is provided.
   */
  name?: string;
  /**
   * The color of the avatar.
   *
   * @default 'accent-strong'
   */
  color?:
    | 'accent-subtle'
    | 'accent-strong'
    | 'neutral-subtle'
    | 'neutral-strong'
    | 'brand1-subtle'
    | 'brand1-strong'
    | 'brand2-subtle'
    | 'brand2-strong'
    | 'brand3-subtle'
    | 'brand3-strong';
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
    color = 'accent-strong',
    size = 'md',
    variant = 'circle',
    className,
    children,
    ...rest
  },
  ref,
) {
  const initials = useMemo(() => {
    if (name) {
      return getInitials(name);
    }
    return null;
  }, [name]);

  return (
    <span
      ref={ref}
      className={cl(
        'ds-avatar',
        `ds-avatar--${variant}`,
        `ds-avatar--${color}`,
        `ds-avatar--${size}`,
        !children && !initials && 'ds-avatar--icon',
        fontSizeMap[size],
        className,
      )}
      {...rest}
      role='img'
      aria-label={name}
    >
      {children || initials || null}
    </span>
  );
});

/**
 * Gets initials using first and last word of a name.
 *
 * @param name
 * @returns
 */
function getInitials(name: string) {
  const splitName = name.trim().split(' ');

  return `${splitName[0][0]}${splitName.length > 1 ? splitName[splitName.length - 1][0] : ''}`.toUpperCase();
}
