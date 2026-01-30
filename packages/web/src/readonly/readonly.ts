import { attr, on, onHotReload } from '../utils/utils';

const isReadOnlyFix = (
  el: unknown,
): el is HTMLInputElement | HTMLSelectElement =>
  (el instanceof HTMLSelectElement ||
    (el instanceof HTMLInputElement &&
      el.matches(
        `[type="range"],[type="color"],[type="checkbox"],[type="radio"],[type="file"]`,
      ))) &&
  el.matches(`[readonly],[aria-readonly="true"]`);

// Allow tabbing when readonly, and only fix readonly input/select elements (since type select and non-text-inputs do not support readonly)
// If radio buttons, move focus without changing checked state
const handleKeyDown = (e: Event & Partial<KeyboardEvent>) => {
  if (e.key !== 'Tab' && isReadOnlyFix(e.target)) {
    e.preventDefault();
    if (e.key?.startsWith('Arrow') && attr(e.target, 'type') === 'radio') {
      const all = document.querySelectorAll(`input[name="${e.target.name}"]`);
      const move = e.key?.match(/Arrow(Right|Down)/) ? 1 : -1;
      const next = all.length + [...all].indexOf(e.target) + move;
      (all[next % all.length] as HTMLElement)?.focus();
    }
  }
};

const handleMouse = (e: Event) => {
  const input = (e.target as Element)?.closest?.('label')?.control || e.target;
  if (isReadOnlyFix(input)) {
    e.preventDefault();
    input.focus();
  }
};

onHotReload('readonly', () => [
  on(document, 'keydown', handleKeyDown),
  on(document, 'click mousedown', handleMouse), // mousedown needed for <select>, click needed for <label> and <input>
]);
