import {
  type Meta,
  type ReactRenderer,
  type StoryContext,
  type StoryFn,
  type StoryObj,
  composeStories,
} from '@storybook/react';
import type { Store_CSFExports, StoryAnnotationsOrFn } from '@storybook/types';

import { type ComponentProps, type ComponentType, createElement } from 'react';

type Story<T extends ComponentType> = StoryObj<T> | StoryFn<T>;
type StoryExports<T extends ComponentType> = Record<string, Story<T>>;

export function createSingleStory<T extends ComponentType>(
  rawStories: StoryExports<T>,
  meta: Meta,
): StoryAnnotationsOrFn<ReactRenderer> {
  const stories = composeStories(
    rawStories as unknown as Store_CSFExports<ReactRenderer, T>,
  ) as StoryExports<T>;
  return {
    render: (_, context) => {
      return (
        <>
          {Object.entries(stories).map(([storyName, story]) => {
            const args = { ...story.args, key: storyName };
            if (typeof story === 'function') {
              return story(
                args as unknown as ComponentProps<T> & T,
                context as StoryContext<ComponentProps<T> & T>,
              );
            }
            if (story.render) {
              return story.render(args, context);
            }
            if (meta.component) {
              return createElement(meta.component, args);
            }
          })}
        </>
      );
    },
    parameters: {
      chromatic: {
        disableSnapshot: false,
      },
      customStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      },
    },
  };
}
