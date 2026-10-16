import type { FigmaMessages } from '../types';

/** Sends a message from the UI to the plugin code (`figma.ui.onmessage`). */
export const postToPlugin = (
  type: FigmaMessages['type'],
  payload?: Record<string, unknown>,
) => {
  parent.postMessage({ pluginMessage: { type, ...payload } }, '*');
};
