import { Modal as ModalRoot } from './Modal';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';

export type { ModalProps } from './Modal';

type ModalComponent = typeof ModalRoot & {
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
};

const Modal = ModalRoot as ModalComponent;

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export { Modal, ModalContent, ModalFooter };
