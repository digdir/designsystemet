import { ModalRoot } from './ModalRoot';
import { ModalContent } from './ModaContent';
import { ModalDialog } from './ModalDialog';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { ModalTrigger } from './ModalTrigger';

export type { ModalRootProps } from './ModalRoot';
export type { ModalHeaderProps } from './ModalHeader';
export type { ModalContentProps } from './ModaContent';
export type { ModalFooterProps } from './ModalFooter';
export type { ModalDialogProps } from './ModalDialog';
export type { ModalTriggerProps } from './ModalTrigger';

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

export {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalDialog,
};
