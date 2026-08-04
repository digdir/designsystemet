import { on, onHotReload } from '../utils/utils';

// Clears and focuses the sibling <input> when the search's reset button is
// clicked, so Search.Clear works without any framework JS. Bails out if
// something else (e.g. React's client Search.Clear) already handled the
// click, to avoid double-handling.
const handleClick = (event: Event) => {
  if (event.defaultPrevented) return;
  let button: HTMLButtonElement | undefined;

  for (const el of event.composedPath() as HTMLButtonElement[]) {
    if (el.nodeName === 'BUTTON') {
      if (el.type === 'reset' && !el.textContent.trim()) button = el; // Find empty reset button
      break;
    }
  }

  const input = button?.previousElementSibling as HTMLInputElement | null;
  if (!button || input?.nodeName !== 'INPUT' || input.type !== 'search') return; // And ensure it is direct subsequent sibling of a search input

  event.preventDefault();
  setInputValue(input, '', 'deleteContentBackward');
  input.focus();
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
