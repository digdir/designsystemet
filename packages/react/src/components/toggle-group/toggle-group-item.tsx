import { forwardRef } from 'react';
import { RovingFocusItem } from '../../utilities/roving-focus/roving-focus-item';
import { Button, type ButtonProps } from '../button/button';
import { useToggleGroupItem } from './use-toggle-groupitem';

export type ToggleGroupItemProps = {
  /**
   * The value of the ToggleGroupItem.
   * Generates a random value if not set.
   **/
  value?: string;
} & Omit<ButtonProps, 'loading' | 'value' | 'variant'>;

/**
 * A single item in a ToggleGroup.
 * @example
 * <ToggleGroupItem value='1'>Toggle 1</ToggleGroupItem>
 */
export const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(function ToggleGroupItem(rest, ref) {
  const { active, buttonProps, value, variant } = useToggleGroupItem(rest);

  return (
    <RovingFocusItem asChild value={value}>
      <Button
        variant={
          active
            ? variant
            : 'tertiary'
        }
        ref={ref}
        {...rest}
        {...buttonProps}
      />
    </RovingFocusItem>
  );
});
