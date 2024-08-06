import { Tab } from './Tab';
import { TabContent } from './TabContent';
import { TabList } from './TabList';
import { TabsRoot } from './TabsRoot';

export type { TabsProps } from './TabsRoot';
export type { TabProps } from './Tab';
export type { TabContentProps } from './TabContent';

type TabsComponent = {
  Root: typeof TabsRoot;
  Tab: typeof Tab;
  List: typeof TabList;
  Content: typeof TabContent;
};

/**
 * Display a group of tabs that can be toggled between.
 * @example
 * ```tsx
 * <Tabs.Root onChange={(value) => console.log(value)}>
 *   <Tabs.List>
 *     <Tabs.Tab value='1'>Tab 1</Tabs.Tab>
 *     <Tabs.Tab value='2'>Tab 2</Tabs.Tab>
 *     <Tabs.Tab value='3'>Tab 3</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Content value='1'>content 1</Tabs.Content>
 *   <Tabs.Content value='2'>content 2</Tabs.Content>
 *   <Tabs.Content value='3'>content 3</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
const Tabs: TabsComponent = {} as TabsComponent;

Tabs.Root = TabsRoot;
Tabs.Tab = Tab;
Tabs.List = TabList;
Tabs.Content = TabContent;

Tabs.Root.displayName = 'Tabs.Root';
Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Content.displayName = 'Tabs.Content';

export { Tabs, TabsRoot, Tab, TabList, TabContent };
