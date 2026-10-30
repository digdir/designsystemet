import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { renderElementAsync } from 'react-live';

export function renderStoryHtml(
  code: string,
  scope: Record<string, unknown>,
): string {
  let html: string | undefined;

  // Despite its name, react-live evaluates our synchronous render(...) stories synchronously.
  renderElementAsync(
    { code, scope, enableTypeScript: true },
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
}
