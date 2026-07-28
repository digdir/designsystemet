import { parseColorValue } from './color';
import { resolveCompositeValue } from './resolver';
import type { PreviewData } from './types';
import { parseNumber } from './utils';

export async function syncEffectStyles(
  preview: PreviewData,
  activeTokenSets: string[],
  logs: string[],
): Promise<void> {
  const desired = preview.flatTokens.filter(
    (token) =>
      token.tokenSet === 'semantic/style' && token.type === 'boxShadow',
  );

  const existing = await figma.getLocalEffectStylesAsync();
  const desiredNames = new Set(desired.map((token) => token.figmaName));

  for (const style of existing) {
    if (style.name.startsWith('shadow/') && !desiredNames.has(style.name)) {
      style.remove();
      logs.push(`Deleted effect style ${style.name}`);
    }
  }

  for (const token of desired) {
    const styleName = token.figmaName;
    const resolved = resolveCompositeValue(
      token.value,
      preview,
      activeTokenSets,
    ) as Array<Record<string, unknown>> | null;

    if (!Array.isArray(resolved)) {
      logs.push(
        `Skipped effect style ${styleName} because it could not be resolved`,
      );
      continue;
    }

    let style = existing.find((item) => item.name === styleName);
    if (!style) {
      style = figma.createEffectStyle();
      style.name = styleName;
      logs.push(`Created effect style ${styleName}`);
    }

    style.effects = resolved
      .map((shadow) => toShadowEffect(shadow))
      .filter((effect): effect is Effect => effect !== null);
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
