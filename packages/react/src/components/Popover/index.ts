import { Popover as PopoverRoot } from './Popover';
import { PopoverContent } from './PopoverContent';
import { PopoverTrigger } from './PopoverTrigger';

type PopoverComponent = typeof PopoverRoot & {
  Content: typeof PopoverContent;
  Trigger: typeof PopoverTrigger;
};

const Popover = PopoverRoot as PopoverComponent;

Popover.Content = PopoverContent;
Popover.Trigger = PopoverTrigger;

Popover.Content.displayName = 'Popover.Content';
Popover.Trigger.displayName = 'Popover.Trigger';

export { Popover, PopoverContent, PopoverTrigger };
