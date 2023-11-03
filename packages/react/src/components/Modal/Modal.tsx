import type { DialogHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  FloatingFocusManager,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Button } from '../Button';
import { Heading, Paragraph } from '../Typography';

import { useScrollLock } from './useScrollLock';
import classes from './Modal.module.css';
import { useModalState } from './useModalState';

export type ModalProps = {
  /**
   * Close modal when clicking on backdrop.
   * @default false
   */
  closeOnBackdropClick?: boolean;
  /**
   * Callback that is called when the modal is closed.
   * @default undefined
   */
  onClose?: () => void;
  /**
   * Header title.
   */
  headerTitle: ReactNode;
  /**
   * Header subtitle.
   */
  headerSubtitle?: string;
  /**
   * Show close button in header.
   * @default true
   */
  closeButton?: boolean;
  /**
   * Show divider between header and content.
   * @default false
   */
  headerDivider?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      headerTitle,
      headerSubtitle,
      headerDivider = false,
      closeOnBackdropClick = false,
      onClose = undefined,
      closeButton = true,
      children,
      ...props
    },
    ref,
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const mergedRefs = useMergeRefs([modalRef, ref]);
    const { context } = useFloating();
    useScrollLock(modalRef, classes.lockScroll);
    const open = useModalState(modalRef);

    useEffect(() => {
      if (!closeOnBackdropClick) return;

      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === modalRef.current && closeOnBackdropClick) {
          // Fix bug where if you select text spanning two divs it closes the modal
          if (window.getSelection()?.toString()) return;

          modalRef.current?.close();
        }
      };

      const currentModalRef = modalRef.current;

      if (currentModalRef)
        currentModalRef.addEventListener('click', handleBackdropClick);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('click', handleBackdropClick);
        }
      };
    }, [closeOnBackdropClick, modalRef, ref]);

    useEffect(() => {
      if (!onClose) return;

      const handleModalClose = () => {
        onClose();
      };

      const currentModalRef = modalRef.current;

      if (currentModalRef)
        currentModalRef.addEventListener('close', handleModalClose);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('close', handleModalClose);
        }
      };
    }, [modalRef, onClose]);

    return (
      <dialog
        ref={mergedRefs}
        className={cn(
          classes.modal,
          headerDivider && classes.divider,
          props.className,
        )}
        {...props}
      >
        {open && (
          <FloatingFocusManager context={context}>
            <>
              <div className={cn(classes.modalHeader)}>
                {headerSubtitle && (
                  <Paragraph size='small'>{headerSubtitle}</Paragraph>
                )}
                <Heading
                  level={2}
                  size='xsmall'
                >
                  {headerTitle}
                </Heading>
                {closeButton && (
                  <Button
                    variant='tertiary'
                    color='second'
                    size='medium'
                    onClick={() => modalRef.current?.close()}
                    autoFocus
                  >
                    <XMarkIcon
                      title='close modal'
                      fontSize='1.5em'
                    />
                  </Button>
                )}
              </div>
              {children}
            </>
          </FloatingFocusManager>
        )}
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';
