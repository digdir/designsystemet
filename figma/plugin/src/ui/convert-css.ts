import type { CssFile, FigmaMessages } from '../types';
import { onPluginMessage, postToPlugin } from './plugin-messages';

type ConvertCssResult = Extract<FigmaMessages, { type: 'convert-css-result' }>;

/** Asks the plugin to create a config from theme CSS files, one per theme, and resolves with its reply. */
export function convertCss(files: CssFile[]): Promise<ConvertCssResult> {
  return new Promise((resolve) => {
    const stop = onPluginMessage((msg) => {
      if (msg.type !== 'convert-css-result') return;
      stop();
      resolve(msg);
    });
    postToPlugin('convert-css', { files });
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
