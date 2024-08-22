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
   */
  color?: 'accent' | 'brand1' | 'brand2' | 'brand3';
  /**
   * The size of the avatar.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLSpanElement>;

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, color, size, className, ...rest },
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
