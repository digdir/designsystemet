import { attr, getComposedTarget, on, onHotReload } from '../utils/utils';

const isReadOnly = (el: Element) =>
  attr(el, 'readonly') !== null || attr(el, 'aria-readonly') === 'true';

// Native readonly is ignored on <select> and <input type="range">, so we block interaction ourselves
const isReadOnlyIgnored = (el: HTMLElement | null): el is HTMLElement =>
  !!el?.matches('select, input[type="range"]') && isReadOnly(el);

const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  const allow = e.key === 'Tab' || e.altKey || e.ctrlKey || e.metaKey; // Allow modifier keys so native functions like CMD + D to bookmark  etc. still works
  if (!allow || e.key?.startsWith('Arrow')) preventIfReadOnly(e);
};

const preventIfReadOnly = (e: Event) => {
  const el = getComposedTarget(e) as HTMLElement | null;
  if (!isReadOnlyIgnored(el)) return;
  e.preventDefault();
  if (e.type !== 'keydown' && el.nodeName === 'INPUT') el.focus(); // Preventing mousedown/touchstart also prevents focus on range, so restore it
};

const handleClick = (e: Event) => {
  for (let el of e.composedPath() as HTMLLabelElement[]) {
    if (el?.nodeName === 'LABEL') el = el.control as HTMLLabelElement;
    if (el?.nodeName === 'INPUT' || el?.nodeName === 'SELECT') {
      if (isReadOnly(el)) {
        e.stopImmediatePropagation(); // Prevent click from reaching React and other listeners
        e.preventDefault();
        el[el.nodeName === 'SELECT' ? 'blur' : 'focus'](); // Blur select to prevent opening on mobile, focus input to recreate <label>-click behavior
        requestAnimationFrame(() => el.isConnected && el.focus()); // Move focus back to select after event has finished bubbling
      }
      return;
    }
  }
};

onHotReload('readonly', () => [
  on(document, 'keydown', handleKeydown),
  on(document, 'click', handleClick, true), // click needed for <label> and <input type="checkbox|radio">, using capture to ensure we run before React
  on(document, 'mousedown', preventIfReadOnly, true), // needed for <select> and <input type="range"> on desktop
  on(document, 'touchstart', preventIfReadOnly, {
    capture: true,
    passive: false,
  }), // needed for <input type="range"> on touch devices
]);
