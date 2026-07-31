import { on, onHotReload } from '../utils/utils';

const SELECTOR_CLEAR = '.ds-search button[type="reset"]';

// Clears and focuses the sibling <input> when the search's reset button is
// clicked, so Search.Clear works without any framework JS. Bails out if
// something else (e.g. React's client Search.Clear) already handled the
// click, to avoid double-handling.
const handleClick = (event: Event) => {
  if (event.defaultPrevented) return;

  // TODO EIRIK: Continue development when https://github.com/digdir/designsystemet/pull/5095 is merged
  const button = (event.target as Element)?.closest?.(SELECTOR_CLEAR);
  const input = button?.closest('.ds-search')?.querySelector('input');
  if (!input) return;

  event.preventDefault();
  const inputProto = HTMLInputElement.prototype;
  const inputEvent = {
    bubbles: true,
    composed: true,
    data: '',
    inputType: 'deleteContentBackward',
  };

  // Trigger value change in React compatible manor https://stackoverflow.com/a/46012210
  input.dispatchEvent(new InputEvent('beforeinput', inputEvent));
  Object.getOwnPropertyDescriptor(inputProto, 'value')?.set?.call(input, '');
  input.dispatchEvent(new InputEvent('input', inputEvent));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

onHotReload('search-clear', () => [on(document, 'click', handleClick)]);
