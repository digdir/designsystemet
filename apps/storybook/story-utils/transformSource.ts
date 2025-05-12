import { DocsContext } from '@storybook/addon-docs';
import type { StoryContext } from '@storybook/react';
import type { Plugin } from 'prettier';
import * as EstreePlugin from 'prettier/plugins/estree';
import * as HtmlPlugin from 'prettier/plugins/html';
import * as TypescriptPlugin from 'prettier/plugins/typescript';
import { format as prettierFormat } from 'prettier/standalone';
import { useContext } from 'react';
import { extractRenderedHtml } from './extractRenderedHtml';

const formatCache = new Map<string, string>();
const htmlCache = new Map<string, string>();

/**
 * Use this as parameters.docs.source.transform as needed to better format React code.
 * Not enabled by default to avoid unnecessary performance hit.
 */
export const formatReactSource = (src: string, ctx: StoryContext) => {
  if (ctx.globals.codePreview === 'react') {
    return asyncFormatWorkaround('typescript', src, ctx);
  }
  return transformSource(src, ctx);
};

export const transformSource = (src: string, ctx: StoryContext) => {
  if (ctx.globals.codePreview === 'html') {
    const docsContext = useContext(DocsContext);
    const storyElement =
      document.getElementById(`story--${ctx.id}-inner`) ??
      document.getElementById(`story--${ctx.id}--primary-inner`);
    if (storyElement && !htmlCache.get(ctx.id)) {
      htmlCache.set(ctx.id, extractRenderedHtml(storyElement));
      // Once the element has been rendered (storyElement !== null),
      // force Storybook to re-render the story, so that the rendered html can be used in the code preview
      docsContext.channel.emit('forceReRender');
    }

    const unformatted = htmlCache.get(ctx.id) ?? '...rendering html...';
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
