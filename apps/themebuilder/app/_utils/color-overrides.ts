import type { ColorScheme } from '@digdir/designsystemet/internal';
import { QUERY_SEPARATOR } from '~/routes/themebuilder/_utils/use-themebuilder';

/**
 * Helpers for the `color-overrides` search param.
 *
 * Format: entries separated by QUERY_SEPARATOR, each entry
 * `<colorName>|<tokenName>|light:<hex>|dark:<hex>` where either mode may be left out.
 */

const HEX_REGEX =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const isValidHex = (value: string) => HEX_REGEX.test(value.trim());

const splitEntries = (param: string | null) =>
  param ? param.split(QUERY_SEPARATOR).filter(Boolean) : [];

const entryPrefix = (colorName: string, tokenName: string) =>
  `${colorName}|${tokenName}|`;

const readModes = (entry: string) => {
  const modes: Partial<Record<ColorScheme, string>> = {};
  for (const part of entry.split('|').slice(2)) {
    const [mode, hex] = part.split(':');
    if ((mode === 'light' || mode === 'dark') && hex) modes[mode] = hex;
  }
  return modes;
};

/** Returns the override hex for one token in one mode, or undefined when not overridden. */
export function getColorOverride(
  param: string | null,
  colorName: string,
  tokenName: string,
  mode: ColorScheme,
): string | undefined {
  const prefix = entryPrefix(colorName, tokenName);
  const entry = splitEntries(param).find((e) => e.startsWith(prefix));
  return entry ? readModes(entry)[mode] : undefined;
}

/**
 * Returns a new `color-overrides` param value with the override for one token in one mode
 * set to `hex`, or removed when `hex` is undefined/empty. The other mode is preserved.
 * Returns '' when no overrides remain (callers should then delete the param).
 */
export function setColorOverride(
  param: string | null,
  colorName: string,
  tokenName: string,
  mode: ColorScheme,
  hex: string | undefined,
): string {
  const prefix = entryPrefix(colorName, tokenName);
  const entries = splitEntries(param);
  const index = entries.findIndex((e) => e.startsWith(prefix));
  const modes = index >= 0 ? readModes(entries[index]) : {};

  const value = hex?.trim();
  if (value) modes[mode] = value;
  else delete modes[mode];

  const parts = [colorName, tokenName];
  if (modes.light) parts.push(`light:${modes.light}`);
  if (modes.dark) parts.push(`dark:${modes.dark}`);
  const next = parts.length > 2 ? parts.join('|') : undefined;

  if (index >= 0) {
    if (next) entries[index] = next;
    else entries.splice(index, 1);
  } else if (next) {
    entries.push(next);
  }

  return entries.join(QUERY_SEPARATOR);
}
