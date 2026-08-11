import type { ColorScheme } from '@digdir/designsystemet-types';
import type { DefaultProps } from './types';

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      /**
       * Use `data-size` to change the size for descendant Designsystemet components and variables.
       *
       * Select from predefined sizes or define your own size.
       */
      'data-size'?: DefaultProps['data-size'];
      /**
       * Use `data-color` to change the color for descendant Designsystemet components and variables.
       *
       * Select from predefined colors and colors defined using theme.designsystemet.no.
       * @link https://theme.designsystemet.no
       */
      'data-color'?: DefaultProps['data-color'];
      /**
       * Use `data-color-scheme` to change the color scheme for descendant Designsystemet components. Select from predefined color schemes.
       * - `'light'`: Use the light color scheme.
       * - `'dark'`: Use the dark color scheme.
       * - `'auto'`: Automatically select the color scheme based on system preferences.
       */
      'data-color-scheme'?: ColorScheme | (string & {});
      // Make React 18 support popover attributes https://github.com/facebook/react/issues/27479
      popovertarget?: string;
      popover?: '' | 'auto' | 'manual' | 'hint';

      // Make React support focusgroup attribute
      focusgroup?: string;
      focusgroupstart?: boolean | undefined;
    }
    // Make React support command attributes https://github.com/facebook/react/issues/27479
    interface ButtonHTMLAttributes<T> extends React.HTMLAttributes<T> {
      command?: string;
      commandfor?: string;
    }
  }
}
