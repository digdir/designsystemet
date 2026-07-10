import { Fragment, type PropsWithChildren } from 'react';
import type preview from '../../../../apps/storybook/.storybook/preview';

/**
 * Structural shape of a composed CSF Next story as exposed from a
 * `import * as Stories from './x.stories'` module.
 *
 * See https://storybook.js.org/docs/api/csf/csf-next
 */
type CSFNextStory = ReturnType<ReturnType<typeof preview.meta>['story']>;

const isStory = (value: unknown): value is CSFNextStory =>
  !!value &&
  typeof value === 'object' &&
  'Component' in value &&
  'composed' in value;

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
export function createSingleStory(rawStories: Record<string, unknown>) {
  const stories = Object.entries(rawStories).filter(
    (entry): entry is [string, CSFNextStory] => isStory(entry[1]),
  );

  return {
    render: () => (
      <>
        {/* Diff fever pixels: */}
        <style>{`[data-storybook-decorator="true"]{padding:0!important}`}</style>
        {stories.map(([storyName, story]) => (
          <story.Component key={storyName} />
        ))}
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
        hover: ['[data-pseudo-state="hover"] > *'],
        active: ['[data-pseudo-state="active"] > *'],
        focusVisible: ['[data-pseudo-state="focusVisible"] > *'],
      },
    },
  };
}
