// Adding support for click deletagtion, following
// https://open-ui.org/components/link-area-delegation-explainer/
// and https://github.com/openui/open-ui/issues/1104#issuecomment-3151387080
import { on, onHotReload } from './dom';

const CLICKDELEGATE = '[data-clickdelegate]';
const CLICKTARGET = '[data-clicktarget]';
const SKIP =
  'a,button,label,input,select,textarea,dialog,[role="button"],[popover],[contenteditable]';

const handleClickDelegate = (event: MouseEvent) => {
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
  if (HOVER) HOVER.classList.remove(':click-delegate-hover');
  if (delegateTarget) delegateTarget.classList.add(':click-delegate-hover');
  HOVER = delegateTarget;
};

const getDelegateTarget = ({ target: el }: Event) => {
  const scope = el instanceof Element ? el.closest(CLICKDELEGATE) : null;
  const target = scope?.querySelector(CLICKTARGET);
  const skip = target && (el as Element).closest(SKIP); // Ignore if interactive

  return ((!skip || skip === target) && target) || undefined;
};

onHotReload('click-delegate', () => [
  on(window, 'click auxclick', handleClickDelegate as EventListener, true), // Use capture to ensure we run before other click listeners
  on(document, 'mouseover', handleMouseOver, { passive: true }), // Use passive for better performance
]);
