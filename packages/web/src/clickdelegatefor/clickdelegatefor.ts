// Adding support for click deletagtion, following
// https://open-ui.org/components/link-area-delegation-explainer/
// and https://github.com/openui/open-ui/issues/1104#issuecomment-3151387080
import { on, onHotReload, QUICK_EVENT } from '../utils/utils';

const CLASS_HOVER = ':click-delegate-hover';
const ATTR_CLICKDELEGATEFOR = 'data-clickdelegatefor';
const SELECTOR_CLICKDELEGATEFOR = `[${ATTR_CLICKDELEGATEFOR}]`;
const SELECTOR_SKIP =
  'a,button,label,input,select,textarea,details,dialog,[role="button"],[popover],[contenteditable]';

export const handleClickDelegateFor = (event: MouseEvent) => {
  const isNewTab = event.button === 1 || event.metaKey || event.ctrlKey;
  const isUserLeftOrMiddleClick = event.isTrusted && event.button < 2;
  const delegateTarget = isUserLeftOrMiddleClick && getDelegateTarget(event);

  if (delegateTarget instanceof HTMLAnchorElement && isNewTab)
    window.open(delegateTarget.href, undefined, delegateTarget.rel); // If middle click or cmd/ctrl click on link, open in new tab
  else if (
    delegateTarget instanceof HTMLElement &&
    !delegateTarget.contains(event.target as Node) // Only proxy event if delegated target isn't the original target
  ) {
    event.stopImmediatePropagation(); // We'll trigger a new click event anyway, so prevent actions on this one
    delegateTarget.click(); // Forward click to the clickable element
  }
};

let HOVER: Element | undefined;
const handleMouseOver = (event: Event) => {
  const delegateTarget = getDelegateTarget(event);
  if (HOVER === delegateTarget) return; // No change
  if (HOVER) HOVER.classList.remove(CLASS_HOVER);
  if (delegateTarget) delegateTarget.classList.add(CLASS_HOVER);
  HOVER = delegateTarget;
};

const getDelegateTarget = ({ target: el }: Event) => {
  const scope =
    el instanceof Element ? el.closest(SELECTOR_CLICKDELEGATEFOR) : null;
  const id = scope?.getAttribute(ATTR_CLICKDELEGATEFOR);
  const target = document.getElementById(id || '');
  const skip = target && (el as Element).closest(SELECTOR_SKIP); // Ignore if interactive

  return ((!skip || skip === target) && target) || undefined;
};

onHotReload('clickdelegatefor', () => [
  on(window, 'click auxclick', handleClickDelegateFor as EventListener, true), // Use capture to ensure we run before other click listeners
  on(document, 'mouseover', handleMouseOver, QUICK_EVENT), // Use passive for better performance
]);
