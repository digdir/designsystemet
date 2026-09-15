import { buildCollectionSpecs } from './collection-specs';
import { syncEffectStyles } from './effect-styles';
import { type FontCache, preloadAllFonts } from './fonts';
import { getActiveTokenSets } from './resolver';
import { applyScopesAndSyntax } from './scope-syntax';
import { syncTextStyles } from './text-styles';
import type { PreviewData } from './types';
import { syncCollections, syncVariables } from './variable-sync';

type ImportPayload = {
  preview: PreviewData;
  selectedTheme: string | null;
  selectedScheme: string | null;
};

export async function importToFigma(
  payload: ImportPayload,
): Promise<{ logs: string[] }> {
  const logs: string[] = [];
  const activeTokenSets = getActiveTokenSets(
    payload.preview,
    payload.selectedTheme,
    payload.selectedScheme,
  );

  const fontCache: FontCache = {
    availableFonts: await figma.listAvailableFontsAsync(),
    loadedFonts: new Set<string>(),
  };

  const collectionSpecs = buildCollectionSpecs(
    payload.preview,
    activeTokenSets,
    logs,
  );

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
  await syncTextStyles(
    payload.preview,
    activeTokenSets,
    variableLookup,
    fontCache,
    logs,
  );
  await syncEffectStyles(payload.preview, activeTokenSets, logs);

  // Auto-apply correct scopes and CSS code syntax so users get them out of the box.
  // Best-effort: the variables are already written, so a failure here must not fail the
  // whole export.
  try {
    await applyScopesAndSyntax(logs);
  } catch (error) {
    logs.push(
      `Scope/syntax pass failed (import still applied): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { logs };
}
