import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type * as React from 'react';

import { Button } from '../../Button';
import { ModalContext } from '../ModalRoot';

export type ModalTriggerProps = {
  asChild?: boolean;
} & React.ComponentPropsWithRef<typeof Button>;

export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild, children, ...rest }, ref) => {
    const Component = asChild ? Slot : Button;

    const { modalRef } = useContext(ModalContext);

    console.log(modalRef);

    return (
      <Component
        ref={ref}
        onClick={() => modalRef?.current?.showModal()}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);
