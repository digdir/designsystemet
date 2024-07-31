import * as R from 'ramda';
import type { ThemeObject } from '@tokens-studio/types';
import { TokenSetStatus } from '@tokens-studio/types';

declare interface Options {
  separator?: string;
}

export type PermutatedTheme = {
  mode?: string;
  semantic?: string;
  size?: string;
  theme?: string;
  typography?: string;
  name: string;
  selectedTokenSets: string[];
};

export type PermutatedThemes = PermutatedTheme[];

function mapThemesToSetsObject(themes: ThemeObject[]): PermutatedThemes {
  return themes.map((theme) => ({ name: theme.name, selectedTokenSets: filterTokenSets(theme.selectedTokenSets) }));
}

export function permutateThemes(themes: ThemeObject[], { separator = '-' } = {} as Options): PermutatedThemes {
  if (!themes.some((theme) => theme.group)) {
    return mapThemesToSetsObject(themes);
  }
  // Sort themes by groups
  const groups: Record<string, ThemeObject[]> = {};
  themes.forEach((theme) => {
    if (theme.group) {
      groups[theme.group] = [...(groups[theme.group] ?? []), theme];
    } else {
      throw new Error(
        `Theme ${theme.name} does not have a group property, which is required for multi-dimensional theming.`,
      );
    }
  });

  if (Object.keys(groups).length <= 1) {
    return mapThemesToSetsObject(themes);
  }

  // Create theme permutations
  const permutations = cartesian(Object.values(groups)) as Array<ThemeObject[]>;

  const permutatedThemes = permutations.map((perm) => {
    const permutatedTheme = perm.reduce(
      (acc, theme) => {
        const { group, name, selectedTokenSets } = theme;
        let updatedPermutatedTheme = acc;

        if (group) {
          const groupProp = R.lensProp<PermutatedTheme>(group.toLowerCase() as keyof PermutatedTheme);
          updatedPermutatedTheme = R.set(groupProp, name.toLowerCase(), updatedPermutatedTheme);
        }

        const updatedName = `${String(acc.name)}${acc ? separator : ''}${name}`;
        const sets = [...updatedPermutatedTheme.selectedTokenSets, ...filterTokenSets(selectedTokenSets)];

        return {
          ...updatedPermutatedTheme,
          name: updatedName,
          selectedTokenSets: sets,
        };
      },
      { name: '', selectedTokenSets: [] } as PermutatedTheme,
    );

    const uniqueTokenSets = new Set(permutatedTheme.selectedTokenSets);

    return { ...permutatedTheme, selectedTokenSets: Array.from(uniqueTokenSets) };
  });

  return permutatedThemes;
}

function filterTokenSets(tokensets: Record<string, TokenSetStatus>) {
  return (
    Object.entries(tokensets)
      .filter(([, val]) => val !== TokenSetStatus.DISABLED)
      // ensure source type sets are always ordered before enabled type sets
      .sort((a, b) => {
        if (a[1] === TokenSetStatus.SOURCE && b[1] === TokenSetStatus.ENABLED) {
          return -1;
        }if (a[1] === TokenSetStatus.ENABLED && b[1] === TokenSetStatus.SOURCE) {
          return 1;
        }
        return 0;
      })
      .map((entry) => entry[0])
  );
}

// cartesian permutations: [[1,2], [3,4]] -> [[1,3], [1,4], [2,3], [2,4]]
function cartesian(a: Array<unknown[]>) {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
}
