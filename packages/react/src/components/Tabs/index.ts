import { Tab } from './Tab';
import { TabList } from './TabList';
import { TabPanel } from './TabPanel';
import { Tabs as TabsParent } from './Tabs';

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
const Tabs = Object.assign(TabsParent, {
  List: TabList,
  Tab,
  Panel: TabPanel,
});

Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Panel.displayName = 'Tabs.Panel';

export type { TabsProps } from './Tabs';
export type { TabProps } from './Tab';
export type { TabPanelProps } from './TabPanel';
export { Tabs, Tab, TabList, TabPanel };
