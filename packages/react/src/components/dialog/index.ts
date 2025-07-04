import { Dialog as DialogParent } from './dialog';
import { DialogBlock } from './dialog-block';
import { DialogTrigger } from './dialog-trigger';
import { DialogTriggerContext } from './dialog-trigger-context';

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
const Dialog = Object.assign(DialogParent, {
  Block: DialogBlock,
  TriggerContext: DialogTriggerContext,
  Trigger: DialogTrigger,
});

Dialog.Block.displayName = 'Dialog.Block';
Dialog.TriggerContext.displayName = 'Dialog.TriggerContext';
Dialog.Trigger.displayName = 'Dialog.Trigger';

export type { DialogProps } from './dialog';
export type { DialogBlockProps } from './dialog-block';
export type { DialogTriggerProps } from './dialog-trigger';
export type { DialogTriggerContextProps } from './dialog-trigger-context';
export { Dialog, DialogBlock, DialogTriggerContext, DialogTrigger };
