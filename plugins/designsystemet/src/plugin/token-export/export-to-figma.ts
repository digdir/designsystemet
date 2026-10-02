import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import { type FontCache, preloadAllFonts } from './fonts';
import { createExportLog, type ExportLog } from './log';
import { getTokenSetLookupOrder } from './resolver';
import { syncTextStyles } from './text-styles';
import type { TokenModel } from './types';
import { syncCollections, syncVariables } from './variable-sync';

/** The number of times `exportToFigma` calls `onStep`, so callers can include the steps in their progress. */
export const EXPORT_STEPS = 5;

// `log` is owned by the caller so it also has the partial log when the export throws.
export async function exportToFigma(
  model: TokenModel,
  log: ExportLog = createExportLog(),
  /** Called with a label before each step of the export. */
  onStep: (label: string) => void = () => {},
): Promise<ExportLog> {
  const tokenSetOrder = getTokenSetLookupOrder(model);

  onStep('Loading fonts');
  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(model, tokenSetOrder, log);

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // export are already bound to font-family variables, Figma will immediately try to
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
