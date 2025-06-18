import type { Size } from '@digdir/designsystemet-react';
import type { Color } from '@digdir/designsystemet-react/colors';

declare global {
  namespace React {
    // biome-ignore lint/correctness/noUnusedVariables: we overwrite React's HTMLAttributes to add custom attributes
    interface HTMLAttributes<T> {
      'data-size'?: Size | (string & {});
      'data-color'?: Color | (string & {});
    }
  }
}
