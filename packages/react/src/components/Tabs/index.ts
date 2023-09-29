import { Tabs as TabsRoot } from './Tabs';
import { TabItem } from './TabItem';
import { TabItemList } from './TabItemList';
import { TabContent } from './TabContent';

export type { TabsProps } from './Tabs';
export type { TabItemProps } from './TabItem';
export type { TabItemListProps } from './TabItemList';
export type { TabContentProps } from './TabContent';

type TabsComponent = typeof TabsRoot & {
  Tab: typeof TabItem;
  List: typeof TabItemList;
  Content: typeof TabContent;
};

const Tabs = TabsRoot as TabsComponent;

Tabs.Tab = TabItem;
Tabs.List = TabItemList;
Tabs.Content = TabContent;

Tabs.Tab.displayName = 'Tabs.Tab';
Tabs.List.displayName = 'Tabs.List';
Tabs.Content.displayName = 'Tabs.Content';

export { Tabs, TabItem, TabItemList, TabContent };
