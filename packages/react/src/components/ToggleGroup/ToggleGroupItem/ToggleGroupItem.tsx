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
} & Omit<ButtonProps, 'loading' | 'size' | 'value'>;

/**
 * A single item in a ToggleGroup.
 * @example
 * <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 */
export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(function ToggleGroupItem({ className, ...rest }, ref) {
  const { active, size = 'md', buttonProps, value } = useToggleGroupItem(rest);

  return (
    <RovingFocusItem asChild value={value}>
      <Button
        className={cl('ds-togglegroup__item', className)}
        variant={active ? 'primary' : 'tertiary'}
        size={size}
        ref={ref}
        {...rest}
        {...buttonProps}
      />
    </RovingFocusItem>
  );
});
