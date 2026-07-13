import {
  attr,
  getComposedTarget,
  getRoot,
  on,
  onHotReload,
} from '../utils/utils';

const isReadOnly = (el: unknown): el is HTMLInputElement | HTMLSelectElement =>
  (el instanceof HTMLSelectElement || el instanceof HTMLInputElement) &&
  (el.hasAttribute('readonly') || attr(el, 'aria-readonly') === 'true');

// Allow tabbing when readonly, and only fix readonly input/select elements (since type select and non-text-inputs do not support readonly)
// If radio buttons, move focus without changing checked state
const handleKeyDown = (e: Event & Partial<KeyboardEvent>) => {
  const el = getComposedTarget(e);
  if (e.key !== 'Tab' && isReadOnly(el)) {
    const isArrow = e.key?.startsWith('Arrow'); // Always control arrow keys
    const isModifier = e.altKey || e.ctrlKey || e.metaKey; // Allow modifier keys so native functions like CMD + D to bookmark  etc. still works

    if (isArrow || !isModifier) e.preventDefault(); // Prevent changing <select> value with keyboard, but allow non-arrow modifier keys
    if (isArrow && attr(el, 'type') === 'radio') {
      const all = getRoot(el).querySelectorAll(`input[name="${el.name}"]`);
      const move = e.key?.match(/Arrow(Right|Down)/) ? 1 : -1;
      const next = all.length + [...all].indexOf(el) + move;
      (all[next % all.length] as HTMLElement)?.focus();
    }
  }
};

const handleClick = (e: Event) => {
  const el = getComposedTarget(e) as Element | null;
  const input = el?.closest?.('label')?.control || el;
  if (isReadOnly(input)) {
    e.preventDefault();
    input.focus();
  }
};

const handleMouseDown = (e: Event) => {
  const el = getComposedTarget(e);
  if (el instanceof HTMLSelectElement && isReadOnly(el)) e.preventDefault();
};

onHotReload('readonly', () => [
  on(document, 'keydown', handleKeyDown),
  on(document, 'click', handleClick), // click needed for <label> and <input>
  on(document, 'mousedown', handleMouseDown), // mousedown needed for <select>
]);
