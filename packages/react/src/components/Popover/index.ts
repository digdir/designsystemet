import type { PopoverContentProps } from './PopoverContent';
import { PopoverContent } from './PopoverContent';
import { PopoverRoot } from './PopoverRoot';
import type { PopoverRootProps } from './PopoverRoot';
import type { PopoverTriggerProps } from './PopoverTrigger';
import { PopoverTrigger } from './PopoverTrigger';

type PopoverComponent = {
  Root: typeof PopoverRoot;
  Content: typeof PopoverContent;
  Trigger: typeof PopoverTrigger;
};

const Popover = {} as PopoverComponent;

Popover.Root = PopoverRoot;
Popover.Content = PopoverContent;
Popover.Trigger = PopoverTrigger;

Popover.Root.displayName = 'Popover.Root';
Popover.Content.displayName = 'Popover.Content';
Popover.Trigger.displayName = 'Popover.Trigger';

export type { PopoverRootProps, PopoverContentProps, PopoverTriggerProps };
export { Popover, PopoverRoot, PopoverContent, PopoverTrigger };
