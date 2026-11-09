import betaToV1 from './beta-to-v1.ts';
import colorRenameNext49 from './color-rename-next49.ts';
import flattenColorCategories from './flatten-color-categories.ts';
import newOutputField from './new-output-field.ts';
import overridesToColorSteps from './overrides-to-color-steps.ts';

export const automigrations = {
  colorCategoryFlattening: flattenColorCategories,
  newOutputField,
  overridesToColorSteps,
};

export default {
  'css-beta-to-v1': betaToV1,
  'css-renames-next48-to-next49': colorRenameNext49,
};
