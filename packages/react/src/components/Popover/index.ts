import type { PopoverProps } from './Popover';
import { Popover as PopoverRoot } from './Popover';
import type { PopoverContentType } from './PopoverContent';
import { PopoverContent } from './PopoverContent';

type PopoverComponent = React.ForwardRefExoticComponent<
  PopoverProps & React.RefAttributes<HTMLDivElement>
> & {
  Content: PopoverContentType;
};

const Popover = PopoverRoot as PopoverComponent;

Popover.Content = PopoverContent;

export { Popover, PopoverContent };
