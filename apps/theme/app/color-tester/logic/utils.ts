export const getFullNameFromShort = (shortName: string): string => {
  if (shortName === 'backgroundDefault') {
    return 'Background Default';
  }
  if (shortName === 'backgroundHover') {
    return 'Background Hover';
  }
  if (shortName === 'backgroundActive') {
    return 'Background Active';
  }
  if (shortName === 'backgroundSubtle') {
    return 'Background Subtle';
  }
  if (shortName === 'surfaceDefault') {
    return 'Surface Default';
  }
  if (shortName === 'surfaceHover') {
    return 'Surface Hover';
  }
  if (shortName === 'surfaceActive') {
    return 'Surface Active';
  }
  if (shortName === 'borderDefault') {
    return 'Border Default';
  }
  if (shortName === 'borderSubtle') {
    return 'Border Subtle';
  }
  if (shortName === 'borderStrong') {
    return 'Border Strong';
  }
  if (shortName === 'baseDefault') {
    return 'Base Default';
  }
  if (shortName === 'baseHover') {
    return 'Base Hover';
  }
  if (shortName === 'baseActive') {
    return 'Base Active';
  }
  if (shortName === 'textDefault') {
    return 'Text Default';
  }
  if (shortName === 'textSubtle') {
    return 'Text Subtle';
  }
  return '';
};
