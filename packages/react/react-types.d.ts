import type { Color, ColorScheme, Size } from '@digdir/designsystemet/types';

declare global {
  namespace React {
    // biome-ignore lint/correctness/noUnusedVariables: we overwrite React's HTMLAttributes to add custom attributes
    interface HTMLAttributes<T> {
      'data-size'?: Size | (string & {});
      'data-color'?: Color | (string & {});
      'data-color-scheme'?: ColorScheme | (string & {});
    }
  }
}
