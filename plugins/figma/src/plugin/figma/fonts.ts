export const getFonts = async () => {
  type FontTest = {
    name: string;
    styles: string[];
  };

  const fonts = await figma.listAvailableFontsAsync();
  const fontArray: FontTest[] = [];

  for (const [index, font] of fonts.entries()) {
    if (index > 0 && fontArray[fontArray.length - 1].name === font.fontName.family) {
      const found = fontArray.find((f) => f.name === font.fontName.family);
      if (found) {
        found.styles.push(font.fontName.style);
      }
      continue;
    }
    fontArray.push({
      name: font.fontName.family,
      styles: [font.fontName.style],
    });
  }
  return fontArray;
};
