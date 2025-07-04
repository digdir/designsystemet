import { Popover as PopoverParent } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverTriggerContext } from './popover-trigger-context';

/**
 * Popover component, used to display content in a popover over an element.
 *
 * @example
 * <Popover.TriggerContext>
 *   <Popover.Trigger>Open Popover</Popover.Trigger>
 *   <Popover>
 *     Content
 *   </Popover>
 * </Popover.TriggerContext>
 */
const Popover = Object.assign(PopoverParent, {
  TriggerContext: PopoverTriggerContext,
  Trigger: PopoverTrigger,
});

Popover.TriggerContext.displayName = 'Popover.TriggerContext';
Popover.Trigger.displayName = 'Popover.Trigger';

export type { PopoverProps } from './popover';
export type { PopoverTriggerProps } from './popover-trigger';
export type { PopoverTriggerContextProps } from './popover-trigger-context';

export { Popover, PopoverTriggerContext, PopoverTrigger };
