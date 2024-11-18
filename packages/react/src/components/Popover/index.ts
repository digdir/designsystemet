import { Popover as PopoverParent } from './Popover';
import { PopoverTrigger } from './PopoverTrigger';
import { PopoverTriggerContext } from './PopoverTriggerContext';

type PopoverComponent = typeof PopoverParent & {
  TriggerContext: typeof PopoverTriggerContext;
  Trigger: typeof PopoverTrigger;
};

const Popover = PopoverParent as PopoverComponent;

Popover.TriggerContext = PopoverTriggerContext;
Popover.Trigger = PopoverTrigger;

Popover.TriggerContext.displayName = 'Popover.TriggerContext';
Popover.Trigger.displayName = 'Popover.Trigger';

export type { PopoverProps } from './Popover';
export type { PopoverTriggerContextProps } from './PopoverTriggerContext';
export type { PopoverTriggerProps } from './PopoverTrigger';
export { Popover, PopoverTriggerContext, PopoverTrigger };
