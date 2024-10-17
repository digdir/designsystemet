import type { ThemeObject } from '@tokens-studio/types';
import { TokenSetStatus } from '@tokens-studio/types';
import chalk from 'chalk';
import { camelCase } from 'change-case';
import * as R from 'ramda';
import { buildOptions } from '../../build';

export type PermutationProps = {
  mode: string;
  semantic: string;
  size: string;
  theme: string;
  typography: string;
};

type ThemeDimension = keyof PermutationProps;

/**
 * Find the theme permutations that are relevant for the given theme dimensions.
 *
 * Technically, for the given dimensions all permutations are included, while for other
 * dimensions the first permutation is used.
 *
 * @param themes Theme objects from $themes.json (Tokens Studio)
 * @param dimensions Which theme dimensions to return permutations for.
 *    'theme' (e.g. altinn/digdir/uutilsynet) is always implicitly included.
 * @returns the relevant theme permutations
 */
export const getMultidimensionalThemes = (themes: ThemeObject[], ...dimensions: ThemeDimension[]) => {
  const verboseLogging = buildOptions?.verbose;
  const grouped$themes = groupThemes(themes);
  const permutations = permutateThemes(grouped$themes);
  const ALL_DEPENDENT_ON: ThemeDimension[] = ['theme'];
  const keys = R.keys(grouped$themes);
  const nonDependentKeys = keys.filter((x) => ![...ALL_DEPENDENT_ON, ...dimensions].includes(x));
  if (verboseLogging) {
    console.log(chalk.cyan(`🔎 Finding theme permutations for ${dimensions}`));
    console.log(chalk.cyan(`   (ignoring permutations for ${nonDependentKeys})`));
  }
  return permutations.filter((val: PermutatedTheme) => {
    const filters = nonDependentKeys.map((x) => val[x] === grouped$themes[x][0].name);
    return filters.every((x) => x);
  });
};

export type PermutatedTheme = {
  name: string;
  selectedTokenSets: string[];
} & Partial<PermutationProps>;

export type PermutatedThemes = PermutatedTheme[];

const processed: unique symbol = Symbol('Type brand for ProcessedThemeObject');
type ProcessedThemeObject = ThemeObject & { [processed]: true };
function isProcessed(theme: ThemeObject | ProcessedThemeObject): theme is ProcessedThemeObject {
  return Boolean((theme as ProcessedThemeObject)[processed]);
}

/**
 * Normalise theme names and theme group names for easier use in code
 * @param theme A theme object from $themes.json
 * @returns Processed theme object
 */
function processThemeObject(theme: ThemeObject | ProcessedThemeObject): ProcessedThemeObject {
  if (isProcessed(theme)) {
    return theme;
  }
  const result: ProcessedThemeObject = { ...theme, [processed]: true };
  if (result.group) {
    result.group = camelCase(result.group);
  }
  result.name = result.name.toLowerCase();
  return result;
}

export type GroupedThemes = Record<keyof PermutationProps, ProcessedThemeObject[]>;

function groupThemes(themes: ThemeObject[]): GroupedThemes {
  const groups = {} as GroupedThemes;
  for (const rawTheme of themes) {
    const theme = processThemeObject(rawTheme);
    if (theme.group) {
      groups[theme.group as keyof GroupedThemes] = [...(groups[theme.group as keyof GroupedThemes] ?? []), theme];
    } else {
      throw new Error(
        `Theme ${theme.name} does not have a group property, which is required for multi-dimensional theming.`,
      );
    }
  }
  return groups;
}

function permutateThemes(groups: GroupedThemes): PermutatedThemes {
  const separator = '_';
  // Create theme permutations
  const permutations = cartesian(Object.values(groups)) as Array<ThemeObject[]>;

  const permutatedThemes = permutations.map((perm) => {
    const permutatedTheme = perm.reduce(
      (acc, theme) => {
        const { group, name, selectedTokenSets } = theme;
        let updatedPermutatedTheme = acc;

        if (group) {
          const groupProp = R.lensProp<PermutatedTheme>(group as keyof PermutationProps);
          updatedPermutatedTheme = R.set(groupProp, name, updatedPermutatedTheme);
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
