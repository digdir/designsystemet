import type { ColorScheme } from '../../colors/types.js';
import type { ColorOverrideSchema } from '../../config.js';
import type { TokenSet } from '../types.js';

/**
 * Applies color overrides to semantic color tokens
 * @param semanticTokens - The semantic color tokens to modify
 * @param overrides - Color overrides from the theme configuration
 * @param colorScheme - The color scheme (light/dark) to apply overrides for
 * @returns Modified semantic tokens with overrides applied
 */
export function applyColorOverrides(
  semanticTokens: TokenSet,
  overrides: ColorOverrideSchema | undefined,
  colorScheme: ColorScheme,
): TokenSet {
  if (!overrides?.colors || colorScheme === 'contrast') {
    return semanticTokens;
  }

  // Create a deep copy of the semantic tokens to avoid mutating the original
  const modifiedTokens = JSON.parse(JSON.stringify(semanticTokens)) as TokenSet;

  // Apply overrides for each semantic color
  Object.entries(overrides.colors).forEach(([colorName, colorWeights]) => {
    if (modifiedTokens.color && typeof modifiedTokens.color === 'object' && !('$value' in modifiedTokens.color)) {
      const colorObject = modifiedTokens.color as TokenSet;

      if (colorName in colorObject) {
        const colorSection = colorObject[colorName];

        if (colorSection && typeof colorSection === 'object' && !('$value' in colorSection)) {
          const colorTokens = colorSection as TokenSet;

          // Apply overrides for each weight/token within the color
          Object.entries(colorWeights).forEach(([tokenName, modeOverrides]) => {
            if (tokenName in colorTokens) {
              const tokenObj = colorTokens[tokenName];

              // Check if this token has an override for the current color scheme
              if (
                tokenObj &&
                typeof tokenObj === 'object' &&
                '$value' in tokenObj &&
                colorScheme in modeOverrides &&
                modeOverrides[colorScheme]
              ) {
                const overrideValue = modeOverrides[colorScheme];
                if (overrideValue) {
                  tokenObj.$value = overrideValue;
                }
              }
            }
          });
        }
      }
    }
  });

  return modifiedTokens;
}
