import type { Size } from '@digdir/designsystemet-react';
import type { Color } from '@digdir/designsystemet-react/colors';

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      'data-size'?: Size | (string & {});
      'data-color'?: Color | (string & {});
    }
  }
}
