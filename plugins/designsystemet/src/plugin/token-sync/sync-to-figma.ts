import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import { type FontCache, preloadAllFonts } from './fonts';
import { createSyncLog, type SyncLog } from './log';
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
): Promise<SyncLog> {
  const tokenSetOrder = getTokenSetLookupOrder(model);

  await onStep('Loading fonts');
  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(model, tokenSetOrder, log);

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // sync are already bound to font-family variables, Figma will immediately try to
  // apply the new font family with whatever style the text style currently has —
  // which may include styles like "Bold" that are not in our token structure.
  // Loading all variants of every font family we will use prevents this.
  await preloadAllFonts(collectionSpecs, fontCache);

  // Adding a mode makes Figma fill in a value for every variable already in the collection.
  await onStep('Syncing variable collections', MAY_FREEZE_NOTE);
  const collectionMap = await syncCollections(collectionSpecs, log);

  // Writes every variable's value in every mode in one go.
  await onStep('Syncing variables', MAY_FREEZE_NOTE);
  const variableLookup = await syncVariables(
    collectionSpecs,
    collectionMap,
    log,
  );

  await onStep('Syncing text styles');
  await syncTextStyles(model, tokenSetOrder, variableLookup, fontCache, log);

  await onStep('Syncing effect styles');
  await syncEffectStyles(model, tokenSetOrder, log);

  return log;
}
