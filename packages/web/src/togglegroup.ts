import { attr, on, onHotReload, onMutation } from './utils';

const ATTR_TOGGLEGROUP = 'data-togglegroup'; // TODO: Use another identifier?
const CSS_TOGGLEGROUP = `[${ATTR_TOGGLEGROUP}]`;

function handleAriaAttributes() {
  for (const group of document.querySelectorAll(CSS_TOGGLEGROUP))
    attr(group, 'aria-label', attr(group, ATTR_TOGGLEGROUP));
}

function handleKeydown(event: Partial<KeyboardEvent>) {
  const group =
    event.target instanceof HTMLInputElement &&
    event.target.closest(CSS_TOGGLEGROUP);

  if (!group) return;
  if (event.key === 'Enter') event.target.click(); // Forward Enter, but no need to listen for space key, as this is handled by the browser
  if (event.key?.startsWith('Arrow')) {
    event.preventDefault?.();
    const inputs = group.getElementsByTagName('input');
    const index = [...inputs].indexOf(event.target);
    const move = event.key.match(/Arrow(Right|Down)/) ? 1 : -1;
    inputs[(inputs.length + index + move) % inputs.length]?.focus();
  }
}

onHotReload('togglegroup', () => [
  on(document, 'keydown', handleKeydown),
  onMutation(document.body, handleAriaAttributes, {
    attributeFilter: [ATTR_TOGGLEGROUP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
