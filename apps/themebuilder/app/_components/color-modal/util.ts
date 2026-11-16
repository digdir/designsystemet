export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const combinations = {
  1: 'color-modal.color-combinations.all-colors',
  2: 'color-modal.color-combinations.all-colors',
  3: 'color-modal.color-combinations.background-subtle-and-default',
  4: 'color-modal.color-combinations.background-subtle-and-default',
  5: 'color-modal.color-combinations.background-subtle-and-default',
  6: 'color-modal.color-combinations.background-colors-and-surface-default',
  7: 'color-modal.color-combinations.background-colors-and-surface-default',
  8: 'color-modal.color-combinations.background-colors-and-surface-default',
  12: 'color-modal.color-combinations.background-colors-and-surface-default',
  13: 'color-modal.color-combinations.background-colors-and-surface-colors',
  14: 'color-modal.color-combinations.background-colors-and-surface-colors',
  15: 'color-modal.color-combinations.base-colors',
  16: 'color-modal.color-combinations.base-colors',
} as const;

/** The translation key for what a step can be used against, by the number of the step. Steps 9 to 11 have none. */
export const getColorCombinations = (colorNumber: number) =>
  (
    combinations as Partial<
      Record<number, (typeof combinations)[keyof typeof combinations]>
    >
  )[colorNumber];
