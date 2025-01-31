import type { Store_CSFExports } from '@storybook/core/types';
import {
  type Meta,
  type ReactRenderer,
  type StoryContext,
  type StoryFn,
  type StoryObj,
  composeStories,
} from '@storybook/react';

import { type ComponentProps, type ComponentType, createElement } from 'react';

type Story<T extends ComponentType> = StoryObj<T> | StoryFn<T>;
type StoryExports<T extends ComponentType> = Record<string, Story<T>>;

export function createSingleStory<T extends ComponentType>(
  rawStories: StoryExports<T>,
  meta: Meta,
): StoryObj<T> {
  const stories = composeStories(
    rawStories as unknown as Store_CSFExports<ReactRenderer, T>,
  ) as StoryExports<T>;
  return {
    render: (_: unknown, context: StoryContext<ComponentProps<T> & T>) => {
      return (
        <>
          {Object.entries(stories).map(([storyName, story]) => {
            const args = { ...story.args, key: storyName };
            if (typeof story === 'function') {
              return story(args as unknown as ComponentProps<T> & T, context);
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
      customStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      },
    },
  } as unknown as StoryObj<T>;
}
