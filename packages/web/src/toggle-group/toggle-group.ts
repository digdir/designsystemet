import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  attrOrCSS,
  on,
  onHotReload,
  onMutation,
  warn,
} from '../utils/utils';

const ATTR_TOGGLEGROUP = 'data-toggle-group';
const SELECTOR_TOGGLEGROUP = `[${ATTR_TOGGLEGROUP}]`;

const handleAriaAttributes = () => {
  for (const group of document.querySelectorAll(SELECTOR_TOGGLEGROUP)) {
    const label = attrOrCSS(group, ATTR_TOGGLEGROUP);
    const labelledby = group.hasAttribute(ARIA_LABELLEDBY);
    if (label || labelledby) attr(group, ARIA_LABEL, labelledby ? null : label);
    else warn(`Missing ${ARIA_LABEL} on:`, group);
  }
};

const handleKeydown = (event: Partial<KeyboardEvent>) => {
  const { key, target: el } = event;
  const group =
    el instanceof HTMLInputElement && el.closest(SELECTOR_TOGGLEGROUP);

  if (!group) return;
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

onHotReload('toggle-group', () => [
  on(document, 'keydown', handleKeydown),
  onMutation(document, handleAriaAttributes, {
    attributeFilter: [ATTR_TOGGLEGROUP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
