import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import {
  assertFontFamiliesAvailable,
  collectFontFamilies,
  collectFontFamiliesInFile,
  type FontCache,
  preloadAllFonts,
} from './fonts';
import { createSyncLog, type SyncLog } from './log';
import { createPause } from './pause';
import { getTokenSetLookupOrder } from './resolver';
import { syncTextStyles } from './text-styles';
import type { TokenModel } from './types';
import { syncCollections, syncVariables } from './variable-sync';

/** Called before each step of the sync. Resolves once the UI has had time to show the step. */
export type OnStep = (label: string, note?: string) => Promise<void>;

/** The number of times `syncToFigma` calls `onStep`, so callers can include the steps in their progress. */
export const SYNC_STEPS = 5;

// For steps that make many synchronous Figma API calls, which block Figma until they finish.
const MAY_FREEZE_NOTE =
  'Figma may stop responding during this step. Keep the plugin open until the sync finishes.';

// `log` is owned by the caller so it also has the partial log when the sync throws.
export async function syncToFigma(
  model: TokenModel,
  log: SyncLog = createSyncLog(),
  onStep: OnStep = async () => {},
  /** Updates the current step's label, e.g. with how many values have been written. */
  onDetail: (label: string) => void = () => {},
): Promise<SyncLog> {
  const tokenSetOrder = getTokenSetLookupOrder(model);
  const pause = createPause(onDetail);

  await onStep('Loading fonts');
  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(model, tokenSetOrder, log);
  const fontFamilies = collectFontFamilies(collectionSpecs);
  assertFontFamiliesAvailable(fontFamilies, fontCache);

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // sync are already bound to font-family variables, Figma will immediately try to
  // apply the new font family with whatever style the text style currently has —
  // which may include styles like "Bold" that are not in our token structure.
  // Loading all variants of every font family we will use, and of those the file
  // uses now, prevents this.
  await preloadAllFonts(
    [...fontFamilies, ...(await collectFontFamiliesInFile())],
    fontCache,
  );

  // Adding a mode makes Figma fill in a value for every variable already in the collection.
  await onStep('Syncing variable collections', MAY_FREEZE_NOTE);
  const collectionMap = await syncCollections(collectionSpecs, log, pause);

  // Writes every variable's value in every mode in one go.
  await onStep('Syncing variables', MAY_FREEZE_NOTE);
  const variableLookup = await syncVariables(
    collectionSpecs,
    collectionMap,
    log,
    pause,
  );

  await onStep('Syncing text styles');
  await syncTextStyles(
    model,
    tokenSetOrder,
    variableLookup,
    fontCache,
    log,
    pause,
  );

  await onStep('Syncing effect styles');
  await syncEffectStyles(model, tokenSetOrder, log);

  return log;
}
