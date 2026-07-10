import { composeStories } from '@storybook/react-vite';

/**
 * Combines all stories from a CSF Next story module into a single story that
 * renders every story stacked, wrapped in per-story styling and pseudo-state
 * containers. Intended to be passed to `meta.story(...)` in a `*.chromatic.tsx`
 * file.
 *
 * @example
 *   const meta = preview.meta({ title: 'Chromatic/Button', component: Button });
 *   export const Snapshots = meta.story(createSingleStory(ButtonStories));
 */
export function createSingleStory(stories: Record<string, unknown>) {
  const composed: Record<string, () => React.ReactNode> = composeStories(
    stories as Parameters<typeof composeStories>[0],
  );

  return {
    render: () => (
      <>
        {/* Diff fever pixels by removing nestes padding: */}
        <style>{`[data-storybook-decorator="true"] [data-storybook-decorator="true"]{ padding: 0!important }`}</style>
        {Object.entries(composed).map(([key, Story]) => {
          // @ts-expect-error pseudo is not typed on composed stories
          const pseudo = stories[key]?.input.parameters?.pseudo;

          return (
            <div key={key} data-pseudo-state={Object.keys(pseudo || {})[0]}>
              <Story />
            </div>
          );
        })}
      </>
    ),
    parameters: {
      chromatic: {
        disableSnapshot: false,
      },
      customStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      } as React.CSSProperties,
      pseudo: {
        hover: ['[data-pseudo-state="hover"] > * > *'],
        active: ['[data-pseudo-state="active"] > * > *'],
        focusVisible: ['[data-pseudo-state="focusVisible"] > * > *'],
      },
    },
  };
}
