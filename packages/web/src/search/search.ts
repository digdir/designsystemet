import { attr, on, onHotReload } from '../utils/utils';

const handleClick = (event: Event) => {
  if (event.defaultPrevented) return;
  for (const el of event.composedPath() as Element[])
    if (el.nodeName === 'BUTTON') {
      const input =
        attr(el, 'data-search') === 'clear' && el.previousElementSibling;

      if (input instanceof HTMLInputElement) {
        event.preventDefault();
        setInputValue(input, '', 'deleteContentBackward');
        input.focus();
      }
      return; // Always stop iterating if we hit a button
    }
};

const setInputValue = (
  input: HTMLInputElement,
  value: string,
  inputType?: string,
) => {
  const proto = HTMLInputElement.prototype;
  const event = { bubbles: true, composed: true, data: value, inputType };

  // Trigger value change in React compatible manor https://stackoverflow.com/a/46012210
  input.dispatchEvent(new InputEvent('beforeinput', event));
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(input, value);
  input.dispatchEvent(new InputEvent('input', event));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

onHotReload('search-clear', () => [on(document, 'click', handleClick)]);
