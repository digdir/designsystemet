import { Tabs as TabsRoot } from './Tabs';
import { Tab } from './Tab';
import { TabList } from './TabItemList';
import { TabContent } from './TabContent';

export type { TabsProps } from './Tabs';
export type { TabProps } from './Tab';
export type { TabContentProps } from './TabContent';

type TabsComponent = typeof TabsRoot & {
  Tab: typeof Tab;
  List: typeof TabList;
  Content: typeof TabContent;
};

const Tabs = TabsRoot as TabsComponent;

Tabs.Tab = Tab;
Tabs.List = TabList;
Tabs.Content = TabContent;

Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Content.displayName = 'Tabs.Content';

export { Tabs, Tab, TabList, TabContent };
