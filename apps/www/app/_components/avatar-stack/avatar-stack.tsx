import type { CSSProperties } from 'react';
import classes from './avatar-stack.module.css';

type AvatarStackProps = {
  authors: string;
};
const avatars = [
  'ardoq',
  'avinor',
  'brønnøysundregistrene',
  'digdir',
  'designsystemet',
  'ksdigital',
  'ks',
  'mattilsynet',
  'oslokommune',
  'skatteetaten',
  'nav',
];

export const AvatarStack = ({ authors }: AvatarStackProps) => {
  const authorsLowercase = authors.toLowerCase();
  const matchedAvatars = avatars.filter((avatar) =>
    authorsLowercase.includes(avatar),
  );
  if (matchedAvatars.length === 0) {
    return null;
  }

  return (
    <span
      className={classes.avatarStack}
      style={{ '--n': matchedAvatars.length } as CSSProperties}
      aria-hidden
    >
      {matchedAvatars.map((avatar) => (
        <img key={avatar} src={`/img/avatars/${avatar}.svg`} alt='' />
      ))}
    </span>
  );
};
