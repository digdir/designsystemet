import { Modal as ModalParent } from './Modal';
import { ModalContext } from './ModalContext';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ModalTrigger } from './ModalTrigger';

const Modal = Object.assign(ModalParent, {
  Context: ModalContext,
  Footer: ModalFooter,
  Header: ModalHeader,
  Trigger: ModalTrigger,
});

Modal.Context.displayName = 'Modal.Root';
Modal.Footer.displayName = 'Modal.Footer';
Modal.Header.displayName = 'Modal.Header';
Modal.Trigger.displayName = 'Modal.Trigger';

export type { ModalContextProps } from './ModalContext';
export type { ModalFooterProps } from './ModalFooter';
export type { ModalHeaderProps } from './ModalHeader';
export type { ModalProps } from './Modal';
export type { ModalTriggerProps } from './ModalTrigger';
export { Modal, ModalContext, ModalFooter, ModalHeader, ModalTrigger };
