import { generateColorScale } from '../colors/scale.ts';
import type { ColorScheme, CssColor } from '../colors/types.ts';
import { focusColor } from '../schemas/defaults.ts';

const cache = new Map<ColorScheme, { inner: CssColor; outer: CssColor }>();

/**
 * The default focus colors in a color scheme: the background (inner) and text (outer) of the scale made from
 * `focusColor`. Building a theme and reading one back both compare against these, so they're made once per scheme.
 */
export function defaultFocusColors(scheme: ColorScheme): { inner: CssColor; outer: CssColor } {
  let colors = cache.get(scheme);
  if (!colors) {
    const scale = generateColorScale(focusColor, scheme);
    colors = { inner: scale['background-default'].hex, outer: scale['text-default'].hex };
    cache.set(scheme, colors);
  }
  return colors;
}
