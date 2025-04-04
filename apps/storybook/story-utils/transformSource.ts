import type { StoryContext } from '@storybook/react';
import * as HTMLParser from 'prettier/parser-html';
import { format as prettierFormat } from 'prettier/standalone';
import * as ReactDOMServer from 'react-dom/server';
import { type FunctionComponent, type ReactNode, createElement } from 'react';

const formatCache = new Map<string, string>();

export const transformSource = (src: string, ctx: StoryContext) => {
  if (ctx.globals.html === 'true') {
    let component: ReactNode;

    //a storyFn expects 1 argument, a storyObj expects 2
    if (ctx.originalStoryFn.length === 1) {
      component = createElement(ctx.originalStoryFn as FunctionComponent);
    } else {
      component = createElement(
        ctx.component as FunctionComponent,
        ctx.initialArgs,
      );
    }

    const unformatted = ReactDOMServer.renderToStaticMarkup(component);

    /*
     * Storybook source transform does not support async, which prettier.format is. The Dutch workaround:
     * https://github.com/nl-design-system/denhaag/blob/a6b10df342be755a4d2fee599eedf914cea287be/packages/storybook/config/preview.tsx#L106
     */
    prettierFormat(unformatted, {
      parser: 'html',
      plugins: [HTMLParser],
    })
      .then((result) => {
        formatCache.set(ctx.id, result);
      })
      .catch((error) => {
        console.error('Error formatting code:', error);
      });

    // Check cache for existing entry
    const formatted = formatCache.get(ctx.id);
    if (formatted) {
      return formatted;
    }
    // Return the unformatted code while waiting for async formatting
    return unformatted;
  }
  return src;
};
