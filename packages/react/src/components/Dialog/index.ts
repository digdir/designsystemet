import { Dialog as DialogParent } from './Dialog';
import { DialogBlock } from './DialogBlock';
import { DialogTrigger } from './DialogTrigger';
import { DialogTriggerContext } from './DialogTriggerContext';

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

export type { DialogBlockProps } from './DialogBlock';
export type { DialogTriggerContextProps } from './DialogTriggerContext';
export type { DialogProps } from './Dialog';
export type { DialogTriggerProps } from './DialogTrigger';
export { Dialog, DialogBlock, DialogTriggerContext, DialogTrigger };
