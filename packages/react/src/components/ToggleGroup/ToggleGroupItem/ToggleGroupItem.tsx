import cl from 'clsx/lite';
import { forwardRef } from 'react';

import { RovingFocusItem } from '../../../utilities/RovingFocus/RovingFocusItem';
import type { ButtonProps } from '../../Button';
import { Button } from '../../Button';

import { useToggleGroupItem } from './useToggleGroupitem';

export type ToggleGroupItemProps = {
  /**
   * The value of the ToggleGroupItem.
   * Generates a random value if not set.
   **/
  value?: string;
} & Omit<ButtonProps, 'value'>;

/**
 * A single item in a ToggleGroup.
 * @example
 * <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 */
export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>((props, ref) => {
  const { children, icon, className, ...rest } = props;
  const { active, size = 'md', buttonProps, value } = useToggleGroupItem(props);

  return (
    <RovingFocusItem asChild value={value}>
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
