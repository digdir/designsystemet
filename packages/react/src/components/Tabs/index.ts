import { Tabs as TabsParent } from './Tabs';
import { TabsList } from './TabsList';
import { TabsPanel } from './TabsPanel';
import { TabsTab } from './TabsTab';

/**
 * Display a group of tabs that can be toggled between.
 * @example
 * ```tsx
 * <Tabs onChange={(value) => console.log(value)}>
 *   <Tabs.List>
 *     <Tabs.Tab selected>Tab 1</Tabs.Tab>
 *     <Tabs.Tab>Tab 2</Tabs.Tab>
 *     <Tabs.Tab>Tab 3</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel>content 1</Tabs.Panel>
 *   <Tabs.Panel hidden>content 2</Tabs.Panel>
 *   <Tabs.Panel hidden>content 3</Tabs.Panel>
 * </Tabs>
 * ```
 */
const Tabs = Object.assign(TabsParent, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Panel.displayName = 'Tabs.Panel';

export type { TabsProps } from './Tabs';
export type { TabsListProps } from './TabsList';
export type { TabsTabProps } from './TabsTab';
export type { TabsPanelProps } from './TabsPanel';
export { Tabs, TabsTab, TabsList, TabsPanel };
