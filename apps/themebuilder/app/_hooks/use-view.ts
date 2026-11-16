import { useSearchParams } from 'react-router';

export const viewNames = ['colorsystem', 'examples'] as const;

export type ViewName = (typeof viewNames)[number];

/** `overview` is the old name of the examples view. Unknown names give the first view. */
export const parseView = (tab: string | null): ViewName => {
  const name = tab === 'overview' ? 'examples' : tab;
  return viewNames.find((view) => view === name) ?? viewNames[0];
};

/** The view that is shown. It is kept in `tab` in the URL, and this is the only place that reads and writes it. */
export const useView = (): [ViewName, (view: ViewName) => void] => {
  const [params, setParams] = useSearchParams();

  const setView = (view: ViewName) =>
    setParams(
      (previous) => {
        previous.set('tab', view);
        return previous;
      },
      /* Scroll is not kept, since the content changes */
      { replace: true },
    );

  return [parseView(params.get('tab')), setView];
};
