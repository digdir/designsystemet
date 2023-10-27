import type { AliasType } from '../types/Aliases';

export const getAliases = async () => {
  const res = await fetch('/api/alias/list', {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  const aliases = (await res.json()) as Promise<{ aliases: AliasType[] }>;

  const filteredAliases: AliasType[] = (await aliases).aliases.filter(
    (item: AliasType) => item.alias.includes('pr'),
  );

  return filteredAliases;
};
