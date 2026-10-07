import type { FigmaMessages } from '../types';
import { postToPlugin } from './post-to-plugin';

type ConvertCssResult = Extract<FigmaMessages, { type: 'convert-css-result' }>;

/** Asks the plugin to create a config from theme CSS, and resolves with its reply. */
export function convertCss(
  css: string,
  fileName?: string,
): Promise<ConvertCssResult> {
  return new Promise((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.figma.com') return;
      const msg = event.data?.pluginMessage as FigmaMessages | undefined;
      if (msg?.type !== 'convert-css-result') return;
      window.removeEventListener('message', handleMessage);
      resolve(msg);
    };
    window.addEventListener('message', handleMessage);
    postToPlugin('convert-css', { css, fileName });
  });
}

/**
 * Whether text to import is theme CSS rather than a JSON config: an uploaded `.css` file, or pasted text that
 * sets Designsystemet's custom properties and isn't a JSON object.
 */
export function isThemeCss(text: string, fileName?: string): boolean {
  return fileName
    ? /\.css$/i.test(fileName)
    : !text.trimStart().startsWith('{') && text.includes('--ds-');
}
