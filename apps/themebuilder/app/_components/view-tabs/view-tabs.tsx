import classes from './view-tabs.module.css';

type ViewTabsProps<Value extends string> = {
  /** Prefix for the tab ids. The tab panel finds its tab with `viewTabId`. */
  id: string;
  'aria-label': string;
  views: readonly { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
};

/** The id of the tab for a view, for `aria-labelledby` on its tab panel */
export const viewTabId = (id: string, value: string) => `${id}-${value}`;

/**
 * The tabs that choose which view is shown.
 * `focusgroup` moves focus between the tabs with the arrow keys, and Enter or Space chooses the focused tab.
 * It is polyfilled by `@digdir/designsystemet-web` in browsers without support.
 */
export const ViewTabs = <Value extends string>({
  id,
  views,
  value,
  onChange,
  ...rest
}: ViewTabsProps<Value>) => {
  return (
    <div
      role='tablist'
      aria-label={rest['aria-label']}
      className={classes.tabs}
      data-size='md'
      /* Arrow keys, Home and End move focus, and the tab list is one tab stop.
       * `nomemory` makes Tab land on the selected tab instead of the last focused one. */
      focusgroup='tablist nomemory'
    >
      {views.map((view) => (
        <button
          key={view.value}
          type='button'
          role='tab'
          id={viewTabId(id, view.value)}
          aria-selected={view.value === value}
          // React only renders unknown attributes as strings, so `true` would be dropped
          {...(view.value === value && {
            focusgroupstart: '' as unknown as boolean,
          })}
          className={`${classes.tab} ds-focus-visible`}
          onClick={() => view.value !== value && onChange(view.value)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
