import type { UHTMLTabsElement } from '@u-elements/u-tabs';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';
import '@u-elements/u-tabs';

export type TabsProps = {
  /** Controlled state for `Tabs` component. */
  value?: string;
  /** Default value. */
  defaultValue?: string;
  /** Callback with selected `TabItem` `value` */
  onChange?: (value: string) => void;
  /**
   * Changes items size and paddings
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
} & HTMLAttributes<UHTMLTabsElement>;

/**
 * Display a group of tabs that can be toggled between.
 * @example
 * ```tsx
 * <Tabs onChange={(value) => console.log(value)}>
 *   <Tabs.List>
 *     <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 *     <Tabs.Tab value='2'>Tab 2</Tabs.Tab>
 *     <Tabs.Tab value='3'>Tab 3</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value='1'>content 1</Tabs.Panel>
 *   <Tabs.Panel value='2'>content 2</Tabs.Panel>
 *   <Tabs.Panel value='3'>content 3</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<UHTMLTabsElement, TabsProps>(function Tabs(
  { size = 'md', value, defaultValue, className, onChange, ...rest },
  ref,
) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);

  // let onValueChange = onChange;
  if (!isControlled) {
    // onValueChange = (newValue: string) => {
    //   setUncontrolledValue(newValue);
    //   onChange?.(newValue);
    // };
    value = uncontrolledValue;
  }
  // onClick={() => tabs.onChange?.(value)}
  // <Context.Provider
  //   value={{
  //     value,
  //     defaultValue,
  //     onChange: onValueChange,
  //     size,
  //   }}
  // >
  //   </Context.Provider>

  return (
    <u-tabs
      class={cl('ds-tabs', className)}
      data-size={size}
      ref={ref}
      {...rest}
    />
  );
});
