import type { Color } from '@digdir/designsystemet-react/colors';
import type { Size } from '@digdir/designsystemet-react/sizes';

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      'data-size'?: Size | (string & {});
      'data-color'?: Color | (string & {});
    }
  }
}
