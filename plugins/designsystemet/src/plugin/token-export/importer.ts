import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import { type FontCache, preloadAllFonts } from './fonts';
import { createImportLog, type ImportLog } from './log';
import { getTokenSetLookupOrder } from './resolver';
import { syncTextStyles } from './text-styles';
import type { TokenModel } from './types';
import { syncCollections, syncVariables } from './variable-sync';

/** The number of times `importToFigma` calls `onStep`, so callers can include the steps in their progress. */
export const IMPORT_STEPS = 5;

// `log` is owned by the caller so it also has the partial log when the import throws.
export async function importToFigma(
  model: TokenModel,
  log: ImportLog = createImportLog(),
  /** Called with a label before each step of the import. */
  onStep: (label: string) => void = () => {},
): Promise<ImportLog> {
  const tokenSetOrder = getTokenSetLookupOrder(model);

  onStep('Loading fonts');
  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(model, tokenSetOrder, log);

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // import are already bound to font-family variables, Figma will immediately try to
  // apply the new font family with whatever style the text style currently has —
  // which may include styles like "Bold" that are not in our token structure.
  // Loading all variants of every font family we will use prevents this.
  await preloadAllFonts(collectionSpecs, fontCache);

  onStep('Creating variable collections');
  const collectionMap = await syncCollections(collectionSpecs, log);

  onStep('Creating variables');
  const variableLookup = await syncVariables(
    collectionSpecs,
    collectionMap,
    log,
  );

  onStep('Creating text styles');
  await syncTextStyles(model, tokenSetOrder, variableLookup, fontCache, log);

  onStep('Creating effect styles');
  await syncEffectStyles(model, tokenSetOrder, log);

  return log;
}
