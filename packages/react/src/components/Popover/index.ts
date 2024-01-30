import { Popover as PopoverRoot } from './Popover';
import type { PopoverContentProps } from './PopoverContent';
import { PopoverContent } from './PopoverContent';
import type { PopoverTriggerProps } from './PopoverTrigger';
import { PopoverTrigger } from './PopoverTrigger';
import type { PopoverProps } from './Popover';

type PopoverComponent = typeof PopoverRoot & {
  Content: typeof PopoverContent;
  Trigger: typeof PopoverTrigger;
};

const Popover = PopoverRoot as PopoverComponent;

Popover.Content = PopoverContent;
Popover.Trigger = PopoverTrigger;

Popover.Content.displayName = 'Popover.Content';
Popover.Trigger.displayName = 'Popover.Trigger';

export type { PopoverProps, PopoverContentProps, PopoverTriggerProps };
export { Popover, PopoverContent, PopoverTrigger };
