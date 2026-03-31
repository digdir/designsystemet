import { attr, getCSSProp, on, onHotReload, warn } from '../utils/utils';

const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_LABEL = 'aria-label';

const handleKeydown = (event: Partial<KeyboardEvent>) => {
  const { key, target: el } = event;
  const group = el instanceof HTMLInputElement && el.closest('fieldset');

  if (!group || !getCSSProp(el, '--_ds-toggle-group')) return;
  if (!attr(group, ARIA_LABEL) && !attr(group, ARIA_LABELLEDBY))
    warn(`Missing ${ARIA_LABEL} or ${ARIA_LABELLEDBY} on:`, group);
  if (key === 'Enter') el.click(); // Forward Enter, but no need to listen for space key, as this is handled by the browser
  if (key?.startsWith('Arrow')) {
    event.preventDefault?.();
    const inputs = [...group.getElementsByTagName('input')];
    const index = inputs.indexOf(el);
    const move = key.match(/Arrow(Right|Down)/) ? 1 : -1;
    let nextIndex = index;

    for (let i = 0; i < inputs.length; i++) {
      nextIndex = (inputs.length + nextIndex + move) % inputs.length;
      if (!inputs[nextIndex]?.disabled) {
        inputs[nextIndex]?.focus();
        break;
      }
    }
  }
};

onHotReload('toggle-group', () => [on(document, 'keydown', handleKeydown)]);
