import { attr, attrOrCSS, on, onHotReload, onMutation } from '../utils/utils';

const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_LABEL = 'aria-label';
const ATTR_TOGGLEGROUP = 'data-toggle-group';
const SELECTOR_TOGGLEGROUP = `[${ATTR_TOGGLEGROUP}]`;

const handleAriaAttributes = () => {
  for (const group of document.querySelectorAll(SELECTOR_TOGGLEGROUP))
    attr(group, 'aria-label', attrOrCSS(group, ATTR_TOGGLEGROUP));
};

const handleKeydown = (event: Partial<KeyboardEvent>) => {
  const { key, target: el } = event;
  const group =
    el instanceof HTMLInputElement && el.closest(SELECTOR_TOGGLEGROUP);

  if (!group) return;
  if (!attr(group, ARIA_LABEL) && !attr(group, ARIA_LABELLEDBY))
    attr(group, ARIA_LABEL, attrOrCSS(group, ATTR_TOGGLEGROUP));
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
