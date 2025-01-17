import { Slot } from '@radix-ui/react-slot';
import { type HTMLAttributes, forwardRef, useContext, version } from 'react';
import type { DefaultProps } from '../../types';
import { Button, type ButtonProps } from '../Button/Button';
import { Context } from './PopoverTriggerContext';

export type PopoverTriggerProps =
  | ({
      inline?: true;
      asChild?: boolean;
    } & HTMLAttributes<HTMLButtonElement> &
      DefaultProps)
  | ({
      inline?: false;
    } & ButtonProps);

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
