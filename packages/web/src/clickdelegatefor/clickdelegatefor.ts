// Adding support for click deletagtion, following
// https://open-ui.org/components/link-area-delegation-explainer/
// and https://github.com/openui/open-ui/issues/1104#issuecomment-3151387080
import {
  attr,
  getComposedTarget,
  getRoot,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

const ATTR_CLICKDELEGATEFOR = 'data-clickdelegatefor';
const CLASS_HOVER = ':click-delegate-hover';
const SKIP = new Set([
  'A',
  'BUTTON',
  'LABEL',
  'INPUT',
  'SELECT',
  'TEXTAREA',
  'DETAILS',
  'DIALOG',
]); // Ignore interactive elements, and elements that create a new "context" or "scope"

const handleClickDelegateFor = (event: MouseEvent) => {
  const isNewTab = event.button === 1 || event.metaKey || event.ctrlKey; // Middle click or cmd/ctrl + click should open in new tab
  const target = getComposedTarget(event);
  const delegateTarget = event.button < 2 && getDelegateTarget(event); // Only accept left or middle clicks

  if (!delegateTarget || delegateTarget.contains(target)) return; // Only proxy event if delegated target isn't part of the original target
  if (isNewTab && delegateTarget instanceof HTMLAnchorElement)
    return window.open(delegateTarget.href, undefined, delegateTarget.rel); // If middle click or cmd/ctrl click on link, open in new tab
  event.stopImmediatePropagation(); // We'll trigger a new click event anyway, so prevent actions on this one
  delegateTarget.click(); // Forward click to the clickable element
};

let HOVER: Element | undefined;
let TARGET: EventTarget; // Used to speed up mouseover handling
const handleMouseMove = (event: Event) => {
  const target = getComposedTarget(event);
  if (!target || target === TARGET) return; // Same target, no need to check delegate target again
  TARGET = target;
  const delegateTarget = getDelegateTarget(event);
  if (HOVER === delegateTarget) return; // No change
  if (HOVER) HOVER.classList.remove(CLASS_HOVER);
  if (delegateTarget) delegateTarget.classList.add(CLASS_HOVER);
  HOVER = delegateTarget;
};

const getDelegateTarget = (event: Event) => {
  for (const el of event.composedPath() as HTMLElement[]) {
    if (el.nodeType !== 1) continue; // Only check elements
    if (isInteractive(el)) return;

    const id = el.getAttribute(ATTR_CLICKDELEGATEFOR);
    const target = id && (getRoot(el).getElementById(id) as HTMLInputElement);
    if (target && !target.disabled && !target.readOnly) return target; // Only return if target is not disabled or readonly
  }
};

const isInteractive = (el: HTMLElement) =>
  el.isContentEditable ||
  el.popover ||
  SKIP.has(el.nodeName) ||
  attr(el, 'role') === 'button';

onHotReload('clickdelegatefor', () => [
  on(window, 'click auxclick', handleClickDelegateFor as EventListener, true), // Use capture to ensure we run before other click listeners
  on(document, 'mousemove', handleMouseMove, QUICK_EVENT), // Use passive for better performance
]);
