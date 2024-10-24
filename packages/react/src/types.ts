export type Size = 'sm' | 'md' | 'lg';

export type PortalProps = {
  /**
   * Portals the floating element outside of the app root and into the body.
   * @see https://floating-ui.com/docs/floatingportal
   * @default false
   */
  portal?: boolean;
};

declare global {
  namespace React.JSX {
    interface IntrinsicAttributes {
      /**
       * Affects the size of components.
       */
      'data-size'?: Size;
    }
  }
  namespace React {
    interface HTMLAttributes<T> {
      /**
       * Affects the size of components.
       */
      'data-size'?: Size;
    }
  }
}
