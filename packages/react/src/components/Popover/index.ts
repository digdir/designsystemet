import { Popover as PopoverParent } from './Popover';
import { PopoverContext } from './PopoverContext';
import { PopoverTrigger } from './PopoverTrigger';

type PopoverComponent = typeof PopoverParent & {
  Context: typeof PopoverContext;
  Trigger: typeof PopoverTrigger;
};

const Popover = PopoverParent as PopoverComponent;

Popover.Context = PopoverContext;
Popover.Trigger = PopoverTrigger;

Popover.Context.displayName = 'Popover.Context';
Popover.Trigger.displayName = 'Popover.Trigger';

export type { PopoverProps } from './Popover';
export type { PopoverContextProps } from './PopoverContext';
export type { PopoverTriggerProps } from './PopoverTrigger';
export { Popover, PopoverContext, PopoverTrigger };
