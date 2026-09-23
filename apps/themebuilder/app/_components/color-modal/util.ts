export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getColorCombinations = (colorNumber: number) => {
  let text = '';
  if (colorNumber === 1 || colorNumber === 2) {
    text += 'color-modal.color-combinations.all-colors';
  } else if (colorNumber === 3 || colorNumber === 4 || colorNumber === 5) {
    text += 'color-modal.color-combinations.background-subtle-and-default';
  } else if (colorNumber === 6) {
    text +=
      'color-modal.color-combinations.background-colors-and-surface-default';
  } else if (colorNumber === 7 || colorNumber === 8) {
    text +=
      'color-modal.color-combinations.background-colors-and-surface-default';
  } else if (colorNumber === 12) {
    text +=
      'color-modal.color-combinations.background-colors-and-surface-default';
  } else if (colorNumber === 13 || colorNumber === 14) {
    text +=
      'color-modal.color-combinations.background-colors-and-surface-colors';
  } else if (colorNumber === 15 || colorNumber === 16) {
    text += 'color-modal.color-combinations.base-colors';
  }
  return text;
};
