import { Avatar, EXPERIMENTAL_AvatarStack } from '@digdir/designsystemet-react';
import classes from './avatar-stack.module.css';

type AvatarStackProps = {
  authors: string;
  expandable?: 'fixed';
};

const avatarMap = {
  ardoq: 'ardoq.svg',
  avinor: 'avinor.svg',
  brønnøysundregistrene: 'brønnøysundregistrene.svg',
  digdir: 'digdir.svg',
  designsystemet: 'designsystemet.svg',
  entur: 'entur.svg',
  helsedirektoratet: 'helsedirektoratet.svg',
  'ks digital': 'ksdigital.svg',
  ks: 'ks.png',
  mattilsynet: 'mattilsynet.svg',
  nav: 'nav.svg',
  nrk: 'nrk.svg',
  'oslo kommune': 'oslokommune.svg',
  politiet: 'politiet.svg',
  skatteetaten: 'skatteetaten.svg',
  'brønnøysund register centre': 'brønnøysundregistrene.svg',
  'norwegian directorate of health': 'helsedirektoratet.svg',
  'norwegian tax administration': 'skatteetaten.svg',
  'oslo municipality': 'oslokommune.svg',
  'norwegian police service': 'politiet.svg',
  'city of oslo': 'oslokommune.svg',
  'the design system': 'designsystemet.svg',
  'norwegian food safety authority': 'mattilsynet.svg',
  husbanken: 'husbanken.svg',
  'housing bank': 'husbanken.svg',
} as const;

type AvatarKey = keyof typeof avatarMap;

export const AvatarStack = ({ authors, expandable }: AvatarStackProps) => {
  // Normalize the authors string for matching: lowercase and trim
  // This avoids case sensitivity issues and allows substring matching
  const authorsNormalized = authors.toLowerCase().trim();

  // Track which avatar images have already been added to avoid duplicates.
  // Multiple keys in avatarMap can map to the same image file (e.g., 'city of oslo'
  // and 'oslo municipality' both map to 'oslokommune.svg'). We only want to show
  // each unique avatar image once.
  const seenAssets = new Set<string>();

  // Find all avatar keys that match the authors string.
  // A match occurs when the normalized authors string contains the normalized key as a substring.
  // This approach avoids the cross-contamination bug where words from different organizations
  // in the authors string (e.g., "Oslo" from "City of Oslo" and "municipality" from "Lillestrøm municipality")
  // would incorrectly combine to match a key like "oslo municipality".
  const matchedAvatars = (Object.keys(avatarMap) as AvatarKey[]).filter(
    (key) => {
      const keyNormalized = key.toLowerCase();
      return authorsNormalized.includes(keyNormalized);
    },
  );

  // Filter out duplicates: if multiple keys map to the same avatar image,
  // only keep the first match to avoid showing the same logo multiple times.
  const uniqueAvatars = matchedAvatars.filter((key) => {
    const assetPath = avatarMap[key];
    if (seenAssets.has(assetPath)) {
      return false;
    }
    seenAssets.add(assetPath);
    return true;
  });

  if (uniqueAvatars.length === 0) {
    return null;
  }

  return (
    <EXPERIMENTAL_AvatarStack
      className={classes.avatarStackOverrides}
      expandable={expandable}
    >
      {uniqueAvatars.map((avatarKey) => (
        <li key={avatarKey}>
          <Avatar aria-hidden>
            <img src={`/img/avatars/${avatarMap[avatarKey]}`} alt='' />
          </Avatar>
        </li>
      ))}
    </EXPERIMENTAL_AvatarStack>
  );
};
