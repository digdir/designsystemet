import { parseColorValue } from './color';
import { changedFields, type ImportLog } from './log';
import {
  isManaged,
  keptWarning,
  markManaged,
  splitLeftovers,
} from './ownership';
import { resolveCompositeValue } from './resolver';
import type { TokenModel } from './types';
import { parseNumber } from './utils';

// Figma effect styles are not mode-aware, so scheme-dependent values (the shadow
// colour) are written for the first theme in the light scheme; see getTokenSetLookupOrder.
export async function syncEffectStyles(
  model: TokenModel,
  tokenSetOrder: string[],
  log: ImportLog,
): Promise<void> {
  const desired = model.flatTokens.filter(
    (token) =>
      token.tokenSet === 'semantic/style' && token.type === 'boxShadow',
  );

  const existing = await figma.getLocalEffectStylesAsync();
  const desiredNames = new Set(desired.map((token) => token.figmaName));

  // Only styles the import created, under the name it gave them, are deleted; see ownership.ts. One renamed or
  // duplicated by hand counts as the user's and is kept. The import's own styles count wherever they are (e.g. if
  // the names it gives change); other styles only count under shadow/, where they're kept and reported.
  const leftovers = splitLeftovers(
    existing.filter(
      (style) => style.name.startsWith('shadow/') || isManaged(style),
    ),
    desiredNames,
    { name: (style) => style.name, managed: isManaged },
  );
  for (const style of leftovers.remove) {
    style.remove();
    log.info.push(`Deleted effect style ${style.name}`);
  }
  if (leftovers.keep.length > 0) {
    log.warnings.push(
      keptWarning(
        { one: 'effect style', many: 'effect styles' },
        leftovers.keep.map((style) => style.name),
      ),
    );
  }

  for (const token of desired) {
    const styleName = token.figmaName;
    const resolved = resolveCompositeValue(
      token.value,
      model,
      tokenSetOrder,
    ) as Array<Record<string, unknown>> | null;

    if (!Array.isArray(resolved)) {
      log.warnings.push(
        `Skipped effect style ${styleName} because it could not be resolved`,
      );
      continue;
    }

    let style = existing.find((item) => item.name === styleName);
    const before = style && { effects: style.effects };
    if (!style) {
      style = figma.createEffectStyle();
      style.name = styleName;
      log.info.push(`Created effect style ${styleName}`);
    }
    // An existing style with a name from the config becomes the import's too, as it's updated from the config.
    markManaged(style);

    style.effects = resolved
      .map((shadow) => toShadowEffect(shadow))
      .filter((effect): effect is Effect => effect !== null);

    if (
      before &&
      changedFields(before, { effects: style.effects }).length > 0
    ) {
      log.info.push(`Updated effect style ${styleName}: effects`);
    }
  }
}

function toShadowEffect(shadow: Record<string, unknown>): Effect | null {
  const color = parseColorValue(shadow.color);
  if (!color) {
    return null;
  }

  return {
    type: 'DROP_SHADOW',
    visible: true,
    blendMode: 'NORMAL',
    color,
    offset: {
      x: parseNumber(shadow.x) || 0,
      y: parseNumber(shadow.y) || 0,
    },
    radius: parseNumber(shadow.blur) || 0,
    spread: parseNumber(shadow.spread) || 0,
  };
}
