import { Modal as ModalRoot } from './Modal';
import { ModalContent, ModalFooter, ModalHeader } from './ModalPieces';

export type { ModalProps } from './Modal';

type ModalComponent = typeof ModalRoot & {
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
};

const Modal = ModalRoot as ModalComponent;

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export { Modal, ModalHeader, ModalContent, ModalFooter };
