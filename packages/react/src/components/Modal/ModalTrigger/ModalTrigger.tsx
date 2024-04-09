import { forwardRef, useContext } from 'react';
import type * as React from 'react';

import { Button } from '../../Button';
import { ModalContext } from '../ModalRoot';

export type ModalTriggerProps = React.ComponentPropsWithRef<typeof Button>;

export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ ...rest }, ref) => {
    const { modalRef, open } = useContext(ModalContext);

    return (
      <Button
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
