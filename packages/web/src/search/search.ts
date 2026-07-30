import { on, onHotReload } from '../utils/utils';

const SELECTOR_CLEAR = '.ds-search button[type="reset"]';

// Clears and focuses the sibling <input> when the search's reset button is
// clicked, so Search.Clear works without any framework JS. Bails out if
// something else (e.g. React's client Search.Clear) already handled the
// click, to avoid double-handling.
const handleClick = (event: MouseEvent) => {
  if (event.defaultPrevented) return;

  const button = (event.target as Element)?.closest?.(SELECTOR_CLEAR);
  const input = button?.closest('.ds-search')?.querySelector('input');
  if (!input) return;

  event.preventDefault();
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
};

onHotReload('search', () => [on(document, 'click', handleClick)]);
