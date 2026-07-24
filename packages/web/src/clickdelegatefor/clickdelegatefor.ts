// Adding support for click deletagtion, following
// https://open-ui.org/components/link-area-delegation-explainer/
// and https://github.com/openui/open-ui/issues/1104#issuecomment-3151387080
import {
  getComposedTarget,
  getRoot,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

const CLASS_HOVER = ':click-delegate-hover';
const ATTR_CLICKDELEGATEFOR = 'data-clickdelegatefor';
const SELECTOR_CLICKDELEGATEFOR = `[${ATTR_CLICKDELEGATEFOR}]`;
const SELECTOR_INACTIVE = `:disabled,[readonly]`;
const SELECTOR_SKIP =
  'a,button,label,input,select,textarea,[contenteditable],[role="button"],details,dialog,[popover]';
// details, dialog and [popover] are added to prevent click delegation inside elements that create a new "context" or "scope"

const handleClickDelegateFor = (event: MouseEvent) => {
  const isNewTab = event.button === 1 || event.metaKey || event.ctrlKey; // Middle click or cmd/ctrl + click should open in new tab
  const delegateTarget =
    event.button < 2 && getDelegateTarget(getComposedTarget(event)); // Only accept left or middle clicks

  if (!delegateTarget || delegateTarget.contains(event.target as Node)) return; // Only proxy event if delegated target isn't part of the original target
  if (isNewTab && delegateTarget instanceof HTMLAnchorElement)
    return window.open(delegateTarget.href, undefined, delegateTarget.rel); // If middle click or cmd/ctrl click on link, open in new tab
  event.stopImmediatePropagation(); // We'll trigger a new click event anyway, so prevent actions on this one
  delegateTarget.click(); // Forward click to the clickable element
};

let HOVER: Element | null = null;
let TARGET: EventTarget; // Used to speed up mouseover handling
const handleMouseMove = (event: Event) => {
  const target = getComposedTarget(event);
  if (!target || target === TARGET) return; // Same target, no need to check delegate target again
  TARGET = target;
  const delegateTarget = getDelegateTarget(target);
  if (HOVER === delegateTarget) return; // No change
  if (HOVER) HOVER.classList.remove(CLASS_HOVER);
  if (delegateTarget) delegateTarget.classList.add(CLASS_HOVER);
  HOVER = delegateTarget;
};

const getDelegateTarget = (el: Element | null) => {
  const scope = el?.closest(SELECTOR_CLICKDELEGATEFOR);
  const id = scope?.getAttribute(ATTR_CLICKDELEGATEFOR);
  const target = scope && id ? getRoot(scope).getElementById(id) : null;
  const skip = target && (el as Element).closest(SELECTOR_SKIP); // Ignore if interactive

  if (skip && skip !== target && scope?.contains(skip)) return null; // Ignore if interactive and inside the scope
  return target?.matches(SELECTOR_INACTIVE) ? null : target; // Ignore inactive elements
};

onHotReload('clickdelegatefor', () => [
  on(window, 'click auxclick', handleClickDelegateFor as EventListener, true), // Use capture to ensure we run before other click listeners
  on(document, 'mousemove', handleMouseMove, QUICK_EVENT), // Use passive for better performance
]);
