import { Modal as ModalRoot } from './Modal';
import { ModalContent } from './ModalContent/ModaContent';
import { ModalFooter } from './ModalFooter/ModalFooter';
import { ModalHeader } from './ModalHeader/ModalHeader';

export type { ModalProps } from './Modal';
export type { ModalHeaderProps } from './ModalHeader/ModalHeader';

type ModalComponent = typeof ModalRoot & {
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
  Header: typeof ModalHeader;
};

const Modal = ModalRoot as ModalComponent;

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;

Modal.Footer.displayName = 'Modal.Footer';
Modal.Header.displayName = 'Modal.Header';
Modal.Content.displayName = 'Modal.Content';

export { Modal, ModalContent, ModalFooter, ModalHeader };
