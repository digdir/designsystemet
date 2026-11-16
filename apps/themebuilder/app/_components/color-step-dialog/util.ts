export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const combinations = {
  1: 'colorStepDialog.color-combinations.all-colors',
  2: 'colorStepDialog.color-combinations.all-colors',
  3: 'colorStepDialog.color-combinations.background-subtle-and-default',
  4: 'colorStepDialog.color-combinations.background-subtle-and-default',
  5: 'colorStepDialog.color-combinations.background-subtle-and-default',
  6: 'colorStepDialog.color-combinations.background-colors-and-surface-default',
  7: 'colorStepDialog.color-combinations.background-colors-and-surface-default',
  8: 'colorStepDialog.color-combinations.background-colors-and-surface-default',
  12: 'colorStepDialog.color-combinations.background-colors-and-surface-default',
  13: 'colorStepDialog.color-combinations.background-colors-and-surface-colors',
  14: 'colorStepDialog.color-combinations.background-colors-and-surface-colors',
  15: 'colorStepDialog.color-combinations.base-colors',
  16: 'colorStepDialog.color-combinations.base-colors',
} as const;

/** The translation key for what a step can be used against, by the number of the step. Steps 9 to 11 have none. */
export const getColorCombinations = (colorNumber: number) =>
  (
    combinations as Partial<
      Record<number, (typeof combinations)[keyof typeof combinations]>
    >
  )[colorNumber];
