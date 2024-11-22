import type { ReactNode } from 'react';
import type { Color } from './colors';

export type Size = 'sm' | 'md' | 'lg';

export type PortalProps = {
  /**
   * Portals the floating element outside of the app root and into the body.
   * @see https://floating-ui.com/docs/floatingportal
   * @default false
   */
  portal?: boolean;
};

export type DefaultProps = {
  'data-size'?: Size;
  /**
   * Sets a color palette which may be used by descendants. Does not affect this component.
   * If left unspecified, the color is inherited from the nearest ancestor with data-color.
   */
  'data-color'?: Color;
};

export type LabelRequired =
  | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
  | { 'aria-label'?: never; 'aria-labelledby': string; label?: never };
