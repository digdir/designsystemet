import { Dialog as DialogParent } from './dialog';
import { DialogBlock } from './dialog-block';
import { DialogTrigger } from './dialog-trigger';
import { DialogTriggerContext } from './dialog-trigger-context';

type Dialog = typeof DialogParent & {
  /**
   * DialogTriggerContext component, used to provide a context for a dialog trigger.
   *
   * @example
   * <Dialog.TriggerContext>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog>
   *     Content
   *   </Dialog>
   * </Dialog.TriggerContext>
   */
  TriggerContext: typeof DialogTriggerContext;
  /**
   * DialogTrigger component, used within a Dialog.TriggerContext to open a dialog.
   *
   * @example
   * <Dialog.TriggerContext>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog>
   *     Content
   *   </Dialog>
   * </Dialog.TriggerContext>
   */
  Trigger: typeof DialogTrigger;
  /**
   * DialogBlock component, used to separate content in a Dialog.
   *
   * @example
   * <Dialog>
   *   <Dialog.Block>
   *     Header
   *   </Dialog.Block>
   *   <Dialog.Block>
   *     Content
   *   </Dialog.Block>
   *   <Dialog.Block>
   *     Footer
   *   </Dialog.Block>
   * </Dialog>
   */
  Block: typeof DialogBlock;
};

/**
 * Dialog component, used to display a Dialog dialog.
 *
 * @example
 * <Dialog.TriggerContext>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog>
 *     <Dialog.Block>
 *       Content
 *     </Dialog.Block>
 *   </Dialog>
 * </Dialog.TriggerContext>
 */
const DialogComponent: Dialog = Object.assign(DialogParent, {
  Block: DialogBlock,
  TriggerContext: DialogTriggerContext,
  Trigger: DialogTrigger,
});

DialogComponent.Block.displayName = 'Dialog.Block';
DialogComponent.TriggerContext.displayName = 'Dialog.TriggerContext';
DialogComponent.Trigger.displayName = 'Dialog.Trigger';

export type { DialogProps } from './dialog';
export type { DialogBlockProps } from './dialog-block';
export type { DialogTriggerProps } from './dialog-trigger';
export type { DialogTriggerContextProps } from './dialog-trigger-context';
export {
  DialogComponent as Dialog,
  DialogBlock,
  DialogTriggerContext,
  DialogTrigger,
};
