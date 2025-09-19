/**
 * Mapping from semantic color token names to their corresponding position
 * in the color scale (1-16)
 */
export const SEMANTIC_TOKEN_TO_SCALE_POSITION: Record<string, number> = {
  'background-default': 1,
  'background-tinted': 2,
  'surface-default': 3,
  'surface-tinted': 4,
  'surface-hover': 5,
  'surface-active': 6,
  'border-subtle': 7,
  'border-default': 8,
  'border-strong': 9,
  'text-subtle': 10,
  'text-default': 11,
  'base-default': 12,
  'base-hover': 13,
  'base-active': 14,
  'base-contrast-subtle': 15,
  'base-contrast-default': 16,
} as const;

/**
 * Valid semantic token names that can be overridden
 */
export type SemanticTokenName = keyof typeof SEMANTIC_TOKEN_TO_SCALE_POSITION;
