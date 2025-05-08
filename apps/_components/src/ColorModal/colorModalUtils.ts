export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getColorCombinations = (colorNumber: number) => {
  let text = '';
  if (colorNumber === 1 || colorNumber === 2) {
    text += 'Alle fargene.';
  } else if (colorNumber === 3 || colorNumber === 4 || colorNumber === 5) {
    text += 'Background subtle- og Default.';
  } else if (colorNumber === 6) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 7 || colorNumber === 8) {
    text += 'Background fargene og Surface Default';
  } else if (colorNumber === 12) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 13 || colorNumber === 14) {
    text += 'Background- og Surface fargene.';
  } else if (colorNumber === 15 || colorNumber === 16) {
    text += 'Base fargene.';
  }
  return text;
};
