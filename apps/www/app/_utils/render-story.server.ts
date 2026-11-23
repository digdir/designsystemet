import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { renderElementAsync } from 'react-live';
import { liveScope } from '~/_components/live-component/scope';
import type { RenderedStory } from './story-html';

const renderStoryHtml = (code: string): string => {
  let html: string | undefined;

  // Despite its name, react-live evaluates our synchronous render(...) stories synchronously.
  renderElementAsync(
    { code, scope: liveScope, enableTypeScript: true },
    (Element) => {
      html = renderToString(createElement(Element));
    },
    (error) => {
      throw error;
    },
  );

  if (html === undefined) {
    throw new Error('Documentation stories must call render synchronously.');
  }

  return html;
};

/**
 * Renders each story to the HTML shown next to its React code.
 *
 * This happens in the loader so the browser receives the result, instead of having to download
 * 'react-dom/server' and compile every story a second time to produce it.
 */
export const addStoryHtml = <T extends { name: string; code: string }>(
  stories: T[],
): (T & RenderedStory)[] =>
  stories.map((story) => {
    try {
      const html = renderStoryHtml(
        `${story.code}\n\nrender(<${story.name} />)`,
      );
      return { ...story, html };
    } catch (error) {
      return { ...story, htmlError: String(error) };
    }
  });
