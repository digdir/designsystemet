import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { Context } from './PopoverTriggerContext';

export type PopoverTriggerProps = ButtonProps;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ id, asChild, ...rest }, ref) {
  const { popoverId } = useContext(Context);
  const Component = asChild ? Slot : Button;

  return (
    <Component
      className='ds-popover--trigger'
      ref={ref}
      popovertarget={popoverId}
      {...rest}
    />
  );
});
