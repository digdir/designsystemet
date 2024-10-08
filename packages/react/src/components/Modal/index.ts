import { Modal as ModalParent } from './Modal';
import { ModalBlock } from './ModalBlock';
import { ModalContext } from './ModalContext';
import { ModalTrigger } from './ModalTrigger';

const Modal = Object.assign(ModalParent, {
  Block: ModalBlock,
  Context: ModalContext,
  Trigger: ModalTrigger,
});

Modal.Block.displayName = 'Modal.Block';
Modal.Context.displayName = 'Modal.Context';
Modal.Trigger.displayName = 'Modal.Trigger';

export type { ModalBlockProps } from './ModalBlock';
export type { ModalContextProps } from './ModalContext';
export type { ModalProps } from './Modal';
export type { ModalTriggerProps } from './ModalTrigger';
export { Modal, ModalBlock, ModalContext, ModalTrigger };
