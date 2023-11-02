import { Modal as ModalRoot, ModalHeader } from './Modal';

export type { ModalProps } from './Modal';

type ModalComponent = typeof ModalRoot & {
  Header: typeof ModalHeader;
};

const Modal = ModalRoot as ModalComponent;

Modal.Header = ModalHeader;

export { Modal, ModalHeader };
