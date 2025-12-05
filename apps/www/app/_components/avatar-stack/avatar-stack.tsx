import type { CSSProperties } from 'react';
import classes from './avatar-stack.module.css';

type AvatarStackProps = {
  authors: string;
};

const avatarMap = {
  ardoq: 'ardoq.svg',
  avinor: 'avinor.svg',
  brønnøysundregistrene: 'brønnøysundregistrene.svg',
  digdir: 'digdir.dvg',
  designsystemet: 'designsystemet.svg',
  'ks digital': 'ksdigital.svg',
  ks: 'ks.png',
  mattilsynet: 'mattilsynet.svg',
  nav: 'nav.svg',
  'oslo kommune': 'oslokommune.svg',
  skatteetaten: 'skatteetaten.svg',
} as const;

type AvatarKey = keyof typeof avatarMap;

export const AvatarStack = ({ authors }: AvatarStackProps) => {
  const authorsLowercase = authors.toLowerCase();

  // Split authors string on common delimiters
  const authorWords = authorsLowercase.split(/[\s,/-]+/).filter(Boolean);

  const matchedAvatars = (Object.keys(avatarMap) as AvatarKey[]).filter(
    (key) => {
      // Split key on delimiters
      const keyWords = key.split(/[\s-]+/).filter(Boolean);
      // Check if all words in the key match words in the authors string
      return keyWords.every((word) =>
        authorWords.some((authorWord) => authorWord.includes(word)),
      );
    },
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
      {matchedAvatars.map((avatarKey) => (
        <img
          key={avatarKey}
          src={`/img/avatars/${avatarMap[avatarKey]}`}
          alt=''
        />
      ))}
    </span>
  );
};
