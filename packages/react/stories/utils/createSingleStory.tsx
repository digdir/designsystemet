import {
  type Meta,
  type ReactRenderer,
  type StoryContext,
  type StoryFn,
  type StoryObj,
  composeStories,
} from '@storybook/react';
import type { Store_CSFExports, StoryAnnotationsOrFn } from '@storybook/types';

import {
  type ComponentProps,
  type ComponentType,
  type PropsWithChildren,
  createElement,
} from 'react';

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
            const { story: storyStyles, ...style } =
              story.parameters?.customStyles ?? {};
            const StoryStyles = ({ children }: PropsWithChildren) => (
              <div
                style={{
                  ...style,
                  ...storyStyles,
                }}
              >
                {children}
              </div>
            );
            const args = { ...story.args, key: storyName };
            if (typeof story === 'function') {
              return (
                <StoryStyles>
                  {story(
                    args as unknown as ComponentProps<T> & T,
                    context as StoryContext<ComponentProps<T> & T>,
                  )}
                </StoryStyles>
              );
            }
            if (story.render) {
              return <StoryStyles>{story.render(args, context)}</StoryStyles>;
            }
            if (meta.component) {
              return (
                <StoryStyles>{createElement(meta.component, args)}</StoryStyles>
              );
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
