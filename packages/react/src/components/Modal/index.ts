import { ModalRoot } from './ModalRoot';
import { ModalContent } from './ModalContent/ModaContent';
import { ModalDialog } from './ModalDialog';
import { ModalFooter } from './ModalFooter/ModalFooter';
import { ModalHeader } from './ModalHeader/ModalHeader';
import { ModalTrigger } from './ModalTrigger/ModalTrigger';

export type { ModalRootProps } from './ModalRoot';
export type { ModalHeaderProps } from './ModalHeader/ModalHeader';
export type { ModalContentProps } from './ModalContent/ModaContent';
export type { ModalFooterProps } from './ModalFooter/ModalFooter';
export type { ModalDialogProps } from './ModalDialog';
export type { ModalTriggerProps } from './ModalTrigger/ModalTrigger';

type ModalComponent = typeof ModalDialog & {
  Root: typeof ModalRoot;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
  Header: typeof ModalHeader;
  Trigger: typeof ModalTrigger;
  Dialog: typeof ModalDialog;
};

const Modal = ModalDialog as ModalComponent;

Modal.Root = ModalRoot;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;
Modal.Trigger = ModalTrigger;
Modal.Dialog = ModalDialog;

Modal.Root.displayName = 'Modal.Root';
Modal.Dialog.displayName = 'Modal.Dialog';
Modal.Footer.displayName = 'Modal.Footer';
Modal.Header.displayName = 'Modal.Header';
Modal.Content.displayName = 'Modal.Content';
Modal.Trigger.displayName = 'Modal.Trigger';

export { Modal, ModalContent, ModalFooter, ModalHeader, ModalTrigger, ModalDialog };
