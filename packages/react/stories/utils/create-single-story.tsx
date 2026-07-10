import type { PropsWithChildren } from 'react';
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
        {stories.map(([storyName, story]) => {
          const params = story.composed.parameters ?? {};
          const { story: storyStyles, ...style } = params.customStyles ?? {};
          const StoryStyles = ({ children }: PropsWithChildren) => (
            <div
              style={{ ...style, ...storyStyles }}
              data-pseudo-state={
                params.pseudo?.hover
                  ? 'hover'
                  : params.pseudo?.active
                    ? 'active'
                    : params.pseudo?.focusVisible
                      ? 'focusVisible'
                      : undefined
              }
            >
              {children}
            </div>
          );
          return (
            <StoryStyles key={storyName}>
              <story.Component />
            </StoryStyles>
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
        hover: ['[data-pseudo-state="hover"] > *'],
        active: ['[data-pseudo-state="active"] > *'],
        focusVisible: ['[data-pseudo-state="focusVisible"] > *'],
      },
    },
  };
}
