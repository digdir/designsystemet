import type { Color, ColorScheme, Size } from '@digdir/designsystemet-types';

declare global {
  namespace React {
    // biome-ignore lint/correctness/noUnusedVariables: we overwrite React's HTMLAttributes to add custom attributes
    interface HTMLAttributes<T> {
      /**
       * Represents the recommended size options for the Designsystemet variables.
       * - `'sm'`: Use the small size.
       * - `'md'`: Use the medium size.
       * - `'lg'`: Use the large size.
       */
      'data-size'?: Size | (string & {});
      /**
       * Represents the available color options for the Designsystemet variables.
       *
       * These are augmented based on your theme configuration.
       *
       * Consist of both main and support colors
       * @link https://theme.designsystemet.no
       */
      'data-color'?: Color | (string & {});
      /**
       * Represents the available color scheme options for the Designsystemet variables.
       * - `'light'`: Use the light color scheme.
       * - `'dark'`: Use the dark color scheme.
       * - `'auto'`: Automatically select the color scheme based on system preferences.
       */
      'data-color-scheme'?: ColorScheme | (string & {});
      // Make React 18 support popover attributes https://github.com/facebook/react/issues/27479
      popovertarget?: string;
      popover?: '' | 'auto' | 'manual' | 'hint';
    }
    // Make React support command attributes https://github.com/facebook/react/issues/27479
    interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
      command?: string;
      commandfor?: string;
    }
  }
}
