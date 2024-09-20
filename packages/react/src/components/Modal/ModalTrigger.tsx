import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { Button } from '../Button/Button';

import { ModalContext } from './ModalRoot';

export type ModalTriggerProps = ComponentPropsWithRef<typeof Button>;

export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild, ...rest }, ref) => {
    const { modalRef, open } = useContext(ModalContext);
    const Component = asChild ? Slot : Button;

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

ModalTrigger.displayName = 'ModalTrigger';
