import type {
  RefAttributes,
  FC,
  ElementType,
  ComponentPropsWithRef,
} from 'react';

export type OverridableComponent<Component, Element extends HTMLElement> = {
  (props: Component & RefAttributes<Element>): ReturnType<FC>;

  <As extends ElementType>(
    props: {
      /** Override html element */
      as?: As;
    } & Component &
      Omit<ComponentPropsWithRef<As>, keyof Component>,
  ): ReturnType<FC>;
};
