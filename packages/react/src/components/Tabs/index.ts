import { Tabs as TabsRoot } from './Tabs';
import { TabItem } from './TabItem';
import { TabItemList } from './TabItemList';
import { TabContent } from './TabContent';

export type { TabsProps } from './Tabs';
export type { TabItemProps } from './TabItem';
export type { TabItemListProps } from './TabItemList';
export type { TabContentProps } from './TabContent';

type TabsComponent = typeof TabsRoot & {
  Item: typeof TabItem;
  ItemList: typeof TabItemList;
  Content: typeof TabContent;
};

const Tabs = TabsRoot as TabsComponent;

Tabs.Item = TabItem;
Tabs.ItemList = TabItemList;
Tabs.Content = TabContent;

Tabs.Item.displayName = 'Tabs.Item';
Tabs.ItemList.displayName = 'Tabs.ItemList';
Tabs.Content.displayName = 'Tabs.Content';

export { Tabs, TabItem, TabItemList, TabContent };
