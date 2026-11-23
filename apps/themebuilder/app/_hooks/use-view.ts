import { useUrlParam } from './use-url-param';

export const viewNames = ['colorsystem', 'examples'] as const;

export type ViewName = (typeof viewNames)[number];

/** `overview` is the old name of the examples view. Unknown names give the first view. */
export const parseView = (tab: string | null): ViewName => {
  const name = tab === 'overview' ? 'examples' : tab;
  return viewNames.find((view) => view === name) ?? viewNames[0];
};

/** The view that is shown. It is kept in `tab` in the URL, and this is the only place that reads and writes it. */
export const useView = (): [ViewName, (view: ViewName) => void] => {
  /* Scroll is not kept, since the content changes */
  const [tab, setView] = useUrlParam('tab');
  return [parseView(tab), setView];
};
