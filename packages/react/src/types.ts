import type { Size } from '@digdir/designsystemet-types';
import type { Placement as FloatingUIPlacement } from '@floating-ui/dom';
import type { ReactNode } from 'react';
import type { Color } from './colors';

export type Placement = FloatingUIPlacement | 'none';

export type DefaultProps = {
  /**
   * Changes size for descendant Designsystemet components. Select from predefined sizes.
   */
  'data-size'?: Size;
  /**
   * Changes color for descendant Designsystemet components.
   * Select from predefined colors and colors defined using theme.designsystemet.no.
   */
  'data-color'?: Color;
};

export type LabelRequired =
  | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
  | { 'aria-label'?: never; 'aria-labelledby': string; label?: never };
