import { getComposedTarget, getRoot, on, onHotReload } from '../utils/utils';

const isReadOnly = (el: Element | null) =>
  el?.hasAttribute('readonly') || el?.getAttribute('aria-readonly') === 'true';

// Allow tabbing when readonly, and only fix readonly input/select elements (since type select and non-text-inputs do not support readonly)
// If radio buttons, move focus without changing checked state
const handleKeyDown = (e: Event & Partial<KeyboardEvent>) => {
  if (e.key === 'Tab') return; // Early return for performance
  const el = getComposedTarget(e);
  if (isReadOnly(el)) {
    const isArrow = e.key?.startsWith('Arrow'); // Always control arrow keys
    const isModifier = e.altKey || e.ctrlKey || e.metaKey; // Allow modifier keys so native functions like CMD + D to bookmark  etc. still works
    if (isArrow || !isModifier) e.preventDefault(); // Prevent changing <select> value with keyboard, but allow non-arrow modifier keys
    if (isArrow && el instanceof HTMLInputElement && el.type === 'radio') {
      const selector = `input[type="radio"][name="${CSS.escape(el.name)}"]`;
      const all = (el.form || getRoot(el)).querySelectorAll(selector);
      const move = e.key?.match(/Arrow(Right|Down)/) ? 1 : -1;
      const next = all.length + [...all].indexOf(el) + move;
      (all[next % all.length] as HTMLElement)?.focus();
    }
  }
};

const handleClick = (e: Event) => {
  const target = getComposedTarget(e);
  const input = (target as Element)?.closest?.('label')?.control || target;
  if (isReadOnly(input) && input instanceof HTMLInputElement) {
    e.preventDefault();
    input.focus();
  }
};

const handleMouseDown = (e: Event) => {
  const el = getComposedTarget(e);
  if (el?.nodeName === 'SELECT' && isReadOnly(el)) e.preventDefault();
};

onHotReload('readonly', () => [
  on(document, 'keydown', handleKeyDown),
  on(document, 'click', handleClick), // click needed for <label> and <input type="checkbox|radio">
  on(document, 'mousedown', handleMouseDown), // mousedown needed for <select>
]);
