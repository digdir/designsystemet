import type { FigmaMessages } from './types';

// Simple helper function to post messages to the Figma UI. This is a wrapper around figma.ui.postMessage that ensures the message type is included in the payload.
// https://developers.figma.com/docs/widgets/handling-user-events
export function postMessage(
  type: FigmaMessages['type'],
  payload: Record<string, unknown> = {},
): void {
  figma.ui.postMessage({ type, ...payload });
}
