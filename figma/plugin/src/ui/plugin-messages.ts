import type { FigmaMessages } from '../types';

/** Sends a message from the UI to the plugin code (`figma.ui.onmessage`). */
export const postToPlugin = (
  type: FigmaMessages['type'],
  payload?: Record<string, unknown>,
) => {
  parent.postMessage({ pluginMessage: { type, ...payload } }, '*');
};

/**
 * Calls `handler` with each message from the plugin code (`figma.ui.postMessage`), and returns a function that
 * stops listening. Use it for every listener in the UI: the messages come from `window.top` with Figma's origin,
 * so checking `event.source` against `window.parent` drops them.
 */
export const onPluginMessage = (handler: (msg: FigmaMessages) => void) => {
  const listener = (event: MessageEvent) => {
    if (event.origin !== 'https://www.figma.com') return;
    const msg = event.data?.pluginMessage as FigmaMessages | undefined;
    if (msg) handler(msg);
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
};
