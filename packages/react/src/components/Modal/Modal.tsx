import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';

import { Button } from '../Button';
import { Context } from './ModalContext';
import { useModalState } from './useModalState';

export type ModalProps = {
  /**
   * Screen reader label of close button. Set false to hide the close button.
   * @default 'Lukk'
   */
  closeLabel?: string | false;
  /**
   * Prevent closing on backdrop click.
   * @default undefined
   */
  preventBackdropClick?: boolean;
  /**
   * Callback that is called when the modal is closed.
   * @default undefined
   */
  onClose?: () => void;
  asChild?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    asChild,
    children,
    className,
    closeLabel = 'Lukk',
    onClose,
    open,
    preventBackdropClick = false,
    ...rest
  },
  ref,
) {
  const contextRef = useContext(Context);
  const modalRef = useRef<HTMLDialogElement>(null); // This local ref is used to make sure the modal works without a ModalContext
  const Component = asChild ? Slot : 'dialog';
  const mergedRefs = useMergeRefs([contextRef, ref, modalRef]);

  useEffect(() => modalRef.current?.[open ? 'showModal' : 'close'](), [open]); // Toggle open based on prop
  useEffect(() => {
    const modal = modalRef.current;
    const handleBackdropClick = (event: MouseEvent) => {
      if (window.getSelection()?.toString()) return; // Fix bug where if you select text spanning two divs it thinks you clicked outside
      if (event.target === modal && !preventBackdropClick) modal?.close();
    };

    modal?.addEventListener('click', handleBackdropClick);
    return () => modal?.removeEventListener('click', handleBackdropClick);
  }, [preventBackdropClick]);

  return (
    <Component className={cl('ds-modal', className)} ref={mergedRefs} {...rest}>
      {closeLabel !== false && (
        <form method='dialog'>
          <Button
            aria-label={closeLabel}
            autoFocus
            className='ds-modal__header__button'
            color='neutral'
            icon
            name='close'
            size='md'
            type='submit'
            variant='tertiary'
          />
        </form>
      )}
      {children}
    </Component>
  );
});
