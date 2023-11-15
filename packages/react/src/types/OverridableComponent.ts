import type {
  RefAttributes,
  FC,
  ElementType,
  ComponentPropsWithRef,
} from 'react';

export type OverridableComponent<
  ComponentProps,
  Element extends HTMLElement,
> = {
  (props: ComponentProps & RefAttributes<Element>): ReturnType<FC>;

  <As extends ElementType>(
    props: {
      /** Override html element */
      as?: As;
    } & ComponentProps &
      Omit<ComponentPropsWithRef<As>, keyof ComponentProps>,
  ): ReturnType<FC>;
} & { displayName?: string };
