import React from "react";

export interface OverridableComponent<Component, Element extends HTMLElement> {
  (props: Component & React.RefAttributes<Element>): ReturnType<React.FC>;

  <As extends React.ElementType>(
    props: {
      as: As;
    } & Component &
      Omit<React.ComponentPropsWithRef<As>, keyof Component>
  ): ReturnType<React.FC>;
}
