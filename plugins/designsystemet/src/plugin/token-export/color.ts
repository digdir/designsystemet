// Two color parsers on purpose: parseColorValue produces a Figma RGBA object for
// variable/effect values, while toCssColor only validates and passes through CSS
// color strings for the UI preview. They accept slightly different inputs
// (trimming, rgb() numeric formats, 4-digit hex), so they are not merged.

export function parseColorValue(value: unknown): RGBA | null {
  if (typeof value !== 'string') {
    return null;
  }

  const rgbaMatch = value.match(
    /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)$/i,
  );
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]) / 255,
      g: Number(rgbaMatch[2]) / 255,
      b: Number(rgbaMatch[3]) / 255,
      a: rgbaMatch[4] === undefined ? 1 : Number(rgbaMatch[4]),
    };
  }

  let hex = value.trim();
  if (!hex.startsWith('#')) {
    return null;
  }

  hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (hex.length !== 6 && hex.length !== 8) {
    return null;
  }

  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}

export function toCssColor(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return value;
  }

  if (/^rgba?\(/i.test(value)) {
    return value;
  }

  return null;
}
