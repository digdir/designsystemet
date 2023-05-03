type PageMenuDataType = {
  title: string;
  children: PageMenuItemType[];
};

type PageMenuItemType = {
  name: string;
  url: string;
  children?: PageMenuItemType[];
};

export type { PageMenuDataType, PageMenuItemType };
