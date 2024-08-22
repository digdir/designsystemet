import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useEffect, useState } from 'react';

export type AvatarProps = {
  name?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { name, ...rest },
  ref,
) {
  const [initials, setInitials] = useState<string>('');

  useEffect(() => {
    if (name) {
      setInitials(getInitials(name));
    }
  }, [name]);

  return (
    <div ref={ref} className={cl('ds-avatar', rest.className)} {...rest}>
      {name && initials}
    </div>
  );
});

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}
