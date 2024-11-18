import { Modal as ModalParent } from './Modal';
import { ModalBlock } from './ModalBlock';
import { ModalTrigger } from './ModalTrigger';
import { ModalTriggerContext } from './ModalTriggerContext';

const Modal = Object.assign(ModalParent, {
  Block: ModalBlock,
  TriggerContext: ModalTriggerContext,
  Trigger: ModalTrigger,
});

Modal.Block.displayName = 'Modal.Block';
Modal.TriggerContext.displayName = 'Modal.TriggerContext';
Modal.Trigger.displayName = 'Modal.Trigger';

export type { ModalBlockProps } from './ModalBlock';
export type { ModalTriggerContextProps } from './ModalTriggerContext';
export type { ModalProps } from './Modal';
export type { ModalTriggerProps } from './ModalTrigger';
export { Modal, ModalBlock, ModalTriggerContext, ModalTrigger };
