import type { Size } from '@digdir/designsystemet-types';
import type { Placement as FloatingUIPlacement } from '@floating-ui/dom';
import type { ReactNode } from 'react';
import type { Color, SeverityColors } from './colors';

export type Placement = FloatingUIPlacement | 'none';

export type DefaultProps = {
  /**
   * Use `data-size` to change the size for descendant Designsystemet components and variables.
   *
   * Select from predefined sizes or define your own size.
   */
  'data-size'?: Size | (string & {});
  /**
   * Use `data-color` to change the color for descendant Designsystemet components and variables.
   *
   * Select from predefined colors and colors defined using theme.designsystemet.no.
   * @link https://theme.designsystemet.no
   */
  'data-color'?: Color | SeverityColors | (string & {});
};

export type LabelRequired =
  | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
  | { 'aria-label'?: never; 'aria-labelledby': string; label?: never };
