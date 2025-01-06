import type { ReactNode } from 'react';
import type { Color } from './colors';

export type Size = 'sm' | 'md' | 'lg';

export type DefaultProps = {
  /**
   * Choose between suggested sizes for descendants Designsystemet components.
   */
  'data-size'?: Size | (string & {});
  /**
   * Sets a color palette for descendants Designsystemet components.
   */
  'data-color'?: Color | (string & {});
};

export type LabelRequired =
  | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
  | { 'aria-label'?: never; 'aria-labelledby': string; label?: never };
