import { Popover as PopoverRoot } from './Popover';
import { PopoverContent } from './PopoverContent';

type PopoverComponent = typeof PopoverRoot & {
  Content: typeof PopoverContent;
};

const Popover = PopoverRoot as PopoverComponent;

Popover.Content = PopoverContent;

export { Popover, PopoverContent };
