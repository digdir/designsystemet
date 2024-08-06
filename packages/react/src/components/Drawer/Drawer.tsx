import React, { type HTMLAttributes } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Button } from '../Button';

import styles from './Drawer.module.css';

export type DrawerProps = {
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: React.ReactNode;
  arialabelCloseDrawer?: string;
} & HTMLAttributes<HTMLDivElement>;

export type DrawerRef = {
  open: () => void;
  close: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
};

export const Drawer = React.forwardRef<DrawerRef, DrawerProps>(
  (
    { children, position = 'right', trigger, arialabelCloseDrawer, ...rest },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      contentRef,
    }));

    return (
      <Dialog.Root
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content
            ref={contentRef}
            className={`${styles.content} ${styles[position]}`}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              contentRef.current?.focus();
            }}
            {...rest}
          >
            <Button
              className={styles.closeButton}
              name='close'
              variant='tertiary'
              color='second'
              size='md'
              onClick={() => setIsOpen(false)}
              aria-label={arialabelCloseDrawer}
              autoFocus
              icon={true}
            >
              <XMarkIcon
                title='close modal'
                fontSize='1.5em'
              />
            </Button>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

Drawer.displayName = 'Drawer';
