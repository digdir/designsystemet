import { TabsRoot } from './TabsRoot';
import { Tab } from './Tab';
import { TabList } from './TabList';
import { TabContent } from './TabContent';

export type { TabsProps } from './TabsRoot';
export type { TabProps } from './Tab';
export type { TabContentProps } from './TabContent';

type TabsComponent = {
  Root: typeof TabsRoot;
  Tab: typeof Tab;
  List: typeof TabList;
  Content: typeof TabContent;
};

const Tabs: TabsComponent = {} as TabsComponent;

Tabs.Root = TabsRoot;
Tabs.Tab = Tab;
Tabs.List = TabList;
Tabs.Content = TabContent;

Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Content.displayName = 'Tabs.Content';

export { Tabs, TabsRoot, Tab, TabList, TabContent };
