import { Dialog as DialogParent } from './dialog';
import { DialogBlock } from './dialog-block';
import { DialogTrigger } from './dialog-trigger';
import { DialogTriggerContext } from './dialog-trigger-context';

type Dialog = typeof DialogParent & {
  /**
   * DialogTriggerContext component, used to provide a context for a dialog trigger.
   *
   * @deprecated Will be removed in the next major version. Connect a `Button` to the dialog with `command="show-modal"` and `commandfor` set to the dialog's `id` instead.
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
   * @deprecated Will be removed in the next major version. Use a `Button` with `command="show-modal"` (or `command="--show-non-modal"`) and `commandfor` set to the dialog's `id` instead.
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
 * <Button command="show-modal" commandfor="my-dialog">Open Dialog</Button>
 * <Dialog id="my-dialog">
 *   <Dialog.Block>
 *     Content
 *   </Dialog.Block>
 * </Dialog>
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
  DialogBlock,
  DialogComponent as Dialog,
  DialogTrigger,
  DialogTriggerContext,
};
