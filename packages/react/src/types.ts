export type Size = 'sm' | 'md' | 'lg';
export type Color =
  | 'accent'
  | 'neutral'
  | 'brand1'
  | 'brand2'
  | 'brand3'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

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
};
