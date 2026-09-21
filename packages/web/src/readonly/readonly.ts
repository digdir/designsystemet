import { attr, getComposedTarget, on, onHotReload } from '../utils/utils';

const isReadOnly = (el: Element) =>
  attr(el, 'readonly') !== null || attr(el, 'aria-readonly') === 'true';

const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  const allow = e.key === 'Tab' || e.altKey || e.ctrlKey || e.metaKey; // Allow modifier keys so native functions like CMD + D to bookmark  etc. still works
  if (!allow || e.key?.startsWith('Arrow')) handleSelect(e);
};

const handleSelect = (e: Event) => {
  const el = getComposedTarget(e) as HTMLSelectElement | null;
  if (el?.nodeName === 'SELECT' && isReadOnly(el)) e.preventDefault();
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
  on(document, 'mousedown', handleSelect, true), // needed for <select> on desktop
]);
