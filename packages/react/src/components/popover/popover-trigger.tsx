import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes, useContext, version } from 'react';
import type { DefaultProps } from '../../types';
import { Button, type ButtonProps } from '../button/button';
import { Context } from './popover-trigger-context';

export type PopoverTriggerProps =
  | ({
      /**
       * Will render the trigger as inline text.
       * @default false
       */
      inline?: true;
      /**
       * Change the default rendered element for the one passed as a child, merging their props and behavior.
       * @default false
       */
      asChild?: boolean;
    } & HTMLAttributes<HTMLButtonElement> &
      DefaultProps)
  | ({
      /**
       * Will render the trigger as inline text.
       * @default false
       */
      inline?: false;
    } & ButtonProps);

/**
 * PopoverTrigger component, used to trigger a popover.
 *
 * @example
 * <PopoverTriggerContext>
 *   <PopoverTrigger>Open Popover</PopoverTrigger>
 *   <Popover>
 *     Content
 *   </Popover>
 * </PopoverTriggerContext>
 *
 * @example inline
 * <PopoverTriggerContext>
 *   <Paragraph>
 *    We can use it <PopoverTrigger inline={true}>inline</PopoverTrigger>.
 *   </Paragraph>
 *   <Popover>
 *     Content
 *   </Popover>
 * </PopoverTriggerContext>
 */
export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ id, inline, asChild, ...rest }, ref) {
  const { popoverId } = useContext(Context);
  const Component = asChild ? Slot : inline ? 'button' : Button;

  const popoverProps = Object.assign(
    {
      [version.startsWith('19') ? 'popoverTarget' : 'popovertarget']: popoverId,
      ...(inline
        ? {
            'data-popover': 'inline',
          }
        : {}),
    },
    rest,
  );

  return <Component ref={ref} {...popoverProps} />;
});
