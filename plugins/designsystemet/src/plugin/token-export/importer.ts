import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import { type FontCache, preloadAllFonts } from './fonts';
import { getTokenSetLookupOrder } from './resolver';
import { applyScopes } from './scopes';
import { syncTextStyles } from './text-styles';
import type { TokenModel } from './types';
import { syncCollections, syncVariables } from './variable-sync';

export async function importToFigma(
  model: TokenModel,
): Promise<{ logs: string[] }> {
  const logs: string[] = [];
  const tokenSetOrder = getTokenSetLookupOrder(model);

  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(model, tokenSetOrder, logs);

  // Fonts must be loaded before syncVariables runs. If text styles from a previous
  // import are already bound to font-family variables, Figma will immediately try to
  // apply the new font family with whatever style the text style currently has —
  // which may include styles like "Bold" that are not in our token structure.
  // Loading all variants of every font family we will use prevents this.
  await preloadAllFonts(collectionSpecs, fontCache);
  const collectionMap = await syncCollections(collectionSpecs, logs);
  const variableLookup = await syncVariables(
    collectionSpecs,
    collectionMap,
    logs,
  );
  await syncTextStyles(model, tokenSetOrder, variableLookup, fontCache, logs);
  await syncEffectStyles(model, tokenSetOrder, logs);

  // Auto-apply correct scopes so users get them out of the box (the WEB code syntax is set
  // when the variables are synced). Best-effort: the variables are already written, so a
  // failure here must not fail the whole export.
  try {
    await applyScopes(logs);
  } catch (error) {
    logs.push(
      `Scope pass failed (import still applied): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { logs };
}
