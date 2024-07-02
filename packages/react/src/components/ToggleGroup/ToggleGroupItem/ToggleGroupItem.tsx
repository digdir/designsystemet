import { forwardRef, useId } from 'react';
import cl from 'clsx/lite';

import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';
import { RovingFocusItem } from '../../../utilities/RovingFocus';

import { useToggleGroupItem } from './useToggleGroupitem';

export type ToggleGroupItemProps = {
  /**
   * The value of the ToggleGroupItem. If not set, the string value of the items children will be used.
   * Generates a random value if not set.
   **/
  value?: string;
} & Omit<ButtonProps, 'value'>;

export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>((props, ref) => {
  const { children, icon, className, ...rest } = props;
  const { active, size = 'md', buttonProps } = useToggleGroupItem(props);
  const genValue = useId();

  return (
    <RovingFocusItem
      asChild
      value={rest.value ?? genValue}
    >
      <Button
        className={cl('ds-togglegroup__item', className)}
        icon={icon}
        variant={active ? 'primary' : 'tertiary'}
        size={size}
        ref={ref}
        {...rest}
        {...buttonProps}
      >
        {children}
      </Button>
    </RovingFocusItem>
  );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';
