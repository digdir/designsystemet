import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type * as React from 'react';

import { Button } from '../../Button';
import { ModalContext } from '../ModalRoot';

export type ModalTriggerProps = {
  asChild?: boolean;
} & React.ComponentPropsWithRef<typeof Button>;

export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : Button;

    const { modalRef, open } = useContext(ModalContext);

    return (
      <Component
        ref={ref}
        onClick={() => modalRef?.current?.showModal()}
        aria-expanded={open}
        aria-haspopup='dialog'
        {...rest}
      />
    );
  },
);
