import { PersonIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useEffect, useState } from 'react';

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
} & HTMLAttributes<HTMLSpanElement>;

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, color = 'accent-strong', size = 'md', className, ...rest },
  ref,
) {
  const [initials, setInitials] = useState<string>('');

  useEffect(() => {
    if (name) {
      setInitials(getInitials(name));
    }
  }, [name]);

  return (
    <span
      ref={ref}
      className={cl(
        'ds-avatar',
        `ds-avatar--${color}`,
        `ds-avatar--${size}`,
        className,
      )}
      {...rest}
      role='img'
      aria-label={name}
    >
      {name ? initials : <PersonIcon fontSize='1.5rem' />}
    </span>
  );
});

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}
