import '../readonly/readonly'; // Load to ensure read only works as users expect
import '../focusgroup/focusgroup'; // Ensure polyfill is loaded
import {
  attr,
  getComposedPath,
  getComposedTarget,
  on,
  onHotReload,
} from '../utils/utils';

const ATTR_FOCUSGROUP = 'focusgroup';
let IS_ARROW: boolean | undefined; // Used to prevent clicks that are a result of keyboard navigation

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

onHotReload('toggle-group', () => [
  on(document, 'click', handleRadioClick, true), // Use capture to ensure we run before React and other listeners
  on(document, 'keydown', handleKeydown),
]);
