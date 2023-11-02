import {
  Modal as ModalRoot,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from './Modal';

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
