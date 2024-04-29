import type { RefAttributes, FC, ElementType, ComponentPropsWithRef } from 'react';

export type OverridableComponent<ComponentProps, Element extends HTMLElement> = {
  (props: ComponentProps & RefAttributes<Element>): ReturnType<FC>;

  <As extends ElementType>(
    props: {
      /** Override html element
       * @deprecated Will be removed in favor of `asChild`
       * @see [Github Issue](https://github.com/digdir/designsystemet/issues/1124)
       */
      as?: As;
    } & ComponentProps &
      Omit<ComponentPropsWithRef<As>, keyof ComponentProps>,
  ): ReturnType<FC>;
} & Pick<FC, 'displayName'>;
