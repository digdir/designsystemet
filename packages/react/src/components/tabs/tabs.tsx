import type { DSTabElement } from '@digdir/designsystemet-web';
import '@digdir/designsystemet-web'; // Import ds-tabs custom element
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import {
  createContext,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';

export type TabsProps = MergeRight<
  DefaultProps & Omit<HTMLAttributes<DSTabElement>, 'onChange' | 'value'>,
  {
    /**
     * Controlled state for `Tabs` component
     * @default undefined
     */
    value?: string;
    /**
     * Default selected tab value
     * @default undefined
     */
    defaultValue?: string;
    /**
     * Callback with selected `TabItem` `value`
     * @default undefined
     */
    onChange?: (value: string) => void;
  }
>;

export type ContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  getPrefixedValue?: (value?: string) => string | undefined;
};

export const Context = createContext<ContextProps>({});

/**
 * Display a group of tabs that can be toggled between.
 *
 * @example
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
 */
export const Tabs = forwardRef<DSTabElement, TabsProps>(function Tabs(
  { value, defaultValue, className, onChange, ...rest },
  ref,
) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);
  const tabsRef = useRef<DSTabElement>(null);
  const valuePrefix = useId(); // Used to generate unique value-based ids for tabs and panels
  const mergedRefs = useMergeRefs([ref, tabsRef]);

  let onValueChange = onChange;
  if (!isControlled) {
    onValueChange = (newValue: string) => {
      setUncontrolledValue(newValue);
      onChange?.(newValue);
    };
    value = uncontrolledValue;
  }

  useEffect(() => {
    if (!isControlled || !tabsRef.current || value === undefined) return;
    tabsRef.current?.tabList?.tabs?.forEach((tab) => {
      if (tab.getAttribute('data-value') === value) tab.click();
    });
  }, [value, isControlled]);

  return (
    <Context.Provider
      value={{
        value,
        defaultValue,
        onChange: onValueChange,
        getPrefixedValue: (value?: string) =>
          value && `${valuePrefix}-${value}`,
      }}
    >
      <ds-tabs
        suppressHydrationWarning // Since <ds-tablist> adds attributes
        ref={mergedRefs}
        class={cl('ds-tabs', className)}
        {...rest}
      />
    </Context.Provider>
  );
});
