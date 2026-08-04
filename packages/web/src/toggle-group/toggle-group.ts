import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  attrOrCSS,
  getComposedPath,
  getComposedTarget,
  on,
  onHotReload,
  onMutation,
  warn,
} from '../utils/utils';

const ATTR_FOCUSGROUP = 'focusgroup';
const ATTR_TOGGLEGROUP = 'data-toggle-group';
const SELECTOR_TOGGLEGROUP = `[${ATTR_TOGGLEGROUP}]`;
let IS_ARROW: boolean | undefined; // Used to prevent clicks that are a result of keyboard navigation

const handleMutations = (root: Document, records?: MutationRecord[]) => {
  for (const r of records || [null]) {
    if (r?.attributeName === ATTR_TOGGLEGROUP) deprecate(r.target as Element);
    else if (!r || r.addedNodes.length) {
      const scope = (r?.target as Element) || root;
      for (const el of scope.querySelectorAll(SELECTOR_TOGGLEGROUP))
        deprecate(el);
    }
  }
};

// Prevent clicks that are a result of keyboard navigation
const handleRadioClick = (e: Event & Partial<PointerEvent>) => {
  if (IS_ARROW && getRadioInFocusGroup(e)) {
    e.preventDefault(); // Only handle clicks that are a result of keyboard navigation
    e.stopImmediatePropagation(); // Prevent stopped "click" from reaching React and other listeners
  }
};

const resetIsArrow = () => (IS_ARROW = false);
const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  IS_ARROW = e.key?.startsWith('Arrow');
  if (e.key === 'Enter') getRadioInFocusGroup(e)?.click(); // Allow Enter to activate the radio input
  if (IS_ARROW) setTimeout(resetIsArrow, 0); // Reset after event loop so we can check if next focus event is a result of arrow key navigation
};

// This function does not handle nested focusgroups, but toggle-groups should not be nested so this is not a problem
const getRadioInFocusGroup = (e: Event) => {
  const el = getComposedTarget(e) as HTMLInputElement | null;
  if (el?.nodeName !== 'INPUT' || el.type !== 'radio' || !el.name) return;
  for (const group of getComposedPath(el) as Set<Element>) {
    if (group.nodeType !== 1 || !group.hasAttribute(ATTR_FOCUSGROUP)) continue; // Ignore non-group nodes
    if (!attr(group, ATTR_FOCUSGROUP)?.includes('radiogroup')) return; // Ignore invalid groups
    return el;
  }
};

const deprecate = (el: Element) => {
  if (el.hasAttribute(ATTR_FOCUSGROUP)) return; // Ignore if already migrated
  const label = attrOrCSS(el, ATTR_TOGGLEGROUP);
  const labelledby = attr(el, ARIA_LABELLEDBY)?.trim();
  const message = `Please use ${ATTR_FOCUSGROUP}="radiogroup" and ${labelledby ? ARIA_LABELLEDBY : ARIA_LABEL}="${labelledby || label}" instead of deprecated ${ATTR_TOGGLEGROUP} on:`;

  attr(el, ARIA_LABEL, labelledby ? null : label);
  attr(el, ATTR_FOCUSGROUP, 'radiogroup');
  warn(message, el);
};

onHotReload('toggle-group', () => [
  on(document, 'click', handleRadioClick, true), // Use capture to ensure we run before React and other listeners
  on(document, 'keydown', handleKeydown),
  onMutation(document, handleMutations, {
    attributeFilter: [ATTR_TOGGLEGROUP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
