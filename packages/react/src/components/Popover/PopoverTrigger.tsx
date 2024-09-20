import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '../Button/Button';
import { Context } from './PopoverContext';

export type PopoverTriggerProps = ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ id, asChild, ...rest }, ref) {
  const { popoverId } = useContext(Context);
  const Component = asChild ? Slot : Button;

  return <Component ref={ref} popovertarget={popoverId} {...rest} />;
});
