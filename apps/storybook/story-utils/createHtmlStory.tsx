import type { StoryFn } from '@storybook/react';
import * as R from 'ramda';
import { memo, useEffect, useRef } from 'react';

const RenderHtmlToNode = memo(({ html }: { html: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.outerHTML = html;
    }
  }, []);

  return <div ref={ref} />;
});

export function createHtmlStory(
  html: string,
  parameters: StoryFn['parameters'] = {},
): StoryFn {
  const story: StoryFn = (_, ctx) => {
    // Since multiple stories are rendered in the same document,
    // we ensure the ids are unique across stories
    let htmlWithUniqueIds = html;
    const ids = html.matchAll(/id=('|")([^'"]+)\1/g);
    for (const matchArray of ids) {
      const id = matchArray[2];
      htmlWithUniqueIds = htmlWithUniqueIds.replaceAll(
        new RegExp(`('|")${id}\\1`, 'g'),
        `$1${ctx.id}-${id}$1`,
      );
    }
    return <RenderHtmlToNode html={htmlWithUniqueIds} />;
  };
  story.parameters = R.mergeDeepLeft(parameters, {
    docs: {
      source: {
        code: html,
        language: 'html',
      },
    },
  } satisfies typeof parameters);
  return story;
}
