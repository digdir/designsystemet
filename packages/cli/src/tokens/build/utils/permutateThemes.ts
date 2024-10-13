import type { ThemeObject } from '@tokens-studio/types';
import { TokenSetStatus } from '@tokens-studio/types';
import { camelCase } from 'change-case';
import * as R from 'ramda';

declare interface Options {
  separator?: string;
}

// Color group names
const PRIMARY_COLOR_GROUP = 'colorPrimary';
const SUPPORT_COLOR_GROUP = 'colorSupport';

// TODO: Should we validate that these groups exist in $theme.json?
export type PermutationProps = {
  mode: string;
  [PRIMARY_COLOR_GROUP]: string;
  [SUPPORT_COLOR_GROUP]: string;
  semantic: string;
  size: string;
  theme: string;
  typography: string;
};

export type PermutatedTheme = {
  name: string;
  selectedTokenSets: string[];
} & Partial<PermutationProps>;

export type GroupedThemes = Record<string, ThemeObject[]>;
export type PermutatedThemes = PermutatedTheme[];

export function permutateThemes(groups: GroupedThemes, { separator = '-' } = {} as Options): PermutatedThemes {
  // Create theme permutations
  const permutations = cartesian(Object.values(groups)) as Array<ThemeObject[]>;

  const permutatedThemes = permutations.map((perm) => {
    const permutatedTheme = perm.reduce(
      (acc, theme) => {
        const { group, name, selectedTokenSets } = theme;
        let updatedPermutatedTheme = acc;

        if (group) {
          const groupProp = R.lensProp<PermutatedTheme>(camelCase(group) as keyof PermutationProps);
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

export function groupThemes(themes: ThemeObject[]): GroupedThemes {
  const groups: GroupedThemes = {};
  for (const theme of themes) {
    if (theme.group) {
      groups[camelCase(theme.group)] = [...(groups[camelCase(theme.group)] ?? []), theme];
    } else {
      throw new Error(
        `Theme ${theme.name} does not have a group property, which is required for multi-dimensional theming.`,
      );
    }
  }
  return groups;
}

function filterTokenSets(tokensets: Record<string, TokenSetStatus>) {
  return (
    Object.entries(tokensets)
      .filter(([, val]) => val !== TokenSetStatus.DISABLED)
      // ensure source type sets are always ordered before enabled type sets
      .sort((a, b) => {
        if (a[1] === TokenSetStatus.SOURCE && b[1] === TokenSetStatus.ENABLED) {
          return -1;
        }
        if (a[1] === TokenSetStatus.ENABLED && b[1] === TokenSetStatus.SOURCE) {
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
