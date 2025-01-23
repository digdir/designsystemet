import { Popover as PopoverParent } from './Popover';
import { PopoverTrigger } from './PopoverTrigger';
import { PopoverTriggerContext } from './PopoverTriggerContext';

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

export type { PopoverProps } from './Popover';
export type { PopoverTriggerContextProps } from './PopoverTriggerContext';
export type { PopoverTriggerProps } from './PopoverTrigger';

export { Popover, PopoverTriggerContext, PopoverTrigger };
