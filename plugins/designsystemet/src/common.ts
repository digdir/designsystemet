import type { FigmaMessages } from './types';

// Record mapping each message type to its payload (the message without its `type` discriminant).
type FigmaMessagePayloads = {
  [Message in FigmaMessages as Message['type']]: Omit<Message, 'type'>;
};

// Simple helper function to post messages to the Figma UI. This is a wrapper around figma.ui.postMessage that ensures the message type is included in the payload.
// https://developers.figma.com/docs/widgets/handling-user-events
// The payload argument is optional for message types without payload fields.
export function postMessage<Type extends FigmaMessages['type']>(
  type: Type,
  ...[payload]: keyof FigmaMessagePayloads[Type] extends never
    ? [payload?: FigmaMessagePayloads[Type]]
    : [payload: FigmaMessagePayloads[Type]]
): void {
  figma.ui.postMessage({ type, ...payload });
}
