import { Modal as ModalRoot } from './Modal';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';

export type { ModalProps } from './Modal';

type ModalComponent = typeof ModalRoot & {
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
  Header: typeof ModalHeader;
};

const Modal = ModalRoot as ModalComponent;

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;

export { Modal, ModalContent, ModalFooter, ModalHeader };
