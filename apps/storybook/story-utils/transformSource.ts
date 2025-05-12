import type { StoryContext } from '@storybook/react';
import type { Plugin } from 'prettier';
import * as EstreePlugin from 'prettier/plugins/estree';
import * as HtmlPlugin from 'prettier/plugins/html';
import * as TypescriptPlugin from 'prettier/plugins/typescript';
import { format as prettierFormat } from 'prettier/standalone';
import { type FunctionComponent, type ReactNode, createElement } from 'react';
import * as ReactDOMServer from 'react-dom/server';

const formatCache = new Map<string, string>();

/**
 * Use this as parameters.docs.source.transform as needed to better format React code.
 * Not enabled by default to avoid unnecessary performance hit.
 */
export const formatReactSource = (src: string, ctx: StoryContext) => {
  // Ignore value of ctx.globals.codePreview, always output as React code
  return asyncFormatWorkaround('typescript', src, ctx);
};

export const transformSource = (src: string, ctx: StoryContext) => {
  if (ctx.globals.codePreview === 'html') {
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

    return asyncFormatWorkaround('html', unformatted, ctx);
  }
  return src;
};

/**
 * Storybook source transform does not support async, which prettier.format is. The Dutch workaround:
 * https://github.com/nl-design-system/denhaag/blob/a6b10df342be755a4d2fee599eedf914cea287be/packages/storybook/config/preview.tsx#L106
 */
function asyncFormatWorkaround(
  format: 'html' | 'typescript',
  unformatted: string,
  ctx: StoryContext,
) {
  const parserPlugins = {
    html: [HtmlPlugin] as Plugin[],
    typescript: [EstreePlugin, TypescriptPlugin] as Plugin[],
  };
  const cacheKey = `${ctx.id}-${format}`;
  prettierFormat(unformatted, {
    parser: format,
    plugins: parserPlugins[format],
  })
    .then((result) => {
      formatCache.set(cacheKey, result);
    })
    .catch((error) => {
      console.error('Error formatting code:', error);
    });

  // Check cache for existing entry
  const formatted = formatCache.get(cacheKey);
  if (formatted) {
    return formatted;
  }
  // Return the unformatted code while waiting for async formatting
  return unformatted;
}
