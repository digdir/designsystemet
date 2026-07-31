import type { ComputePositionConfig, MiddlewareState } from '@floating-ui/dom';
import {
  autoUpdate,
  computePosition,
  flip,
  limitShift,
  offset,
  shift,
  size,
} from '@floating-ui/dom';
import {
  isPolyfilled,
  isSupported,
  apply as polyfillPopover,
} from '@oddbird/popover-polyfill/fn';
import {
  attr,
  getComposedTarget,
  getCSSProp,
  getRoot,
  isBrowser,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

if (isBrowser() && !isSupported() && !isPolyfilled())
  polyfillPopover({ layerName: 'ds.base' }); // Load popover polyfill in the ds.base CSS layer to keep cascade order consistent with Designsystemet layers.

// NOTE:
// The native popover event "toggle" is not composed, meaning it does not bubble out of shadow DOM.
// This means that if a popover is inside a shadow root, the toggle event will not be visible outside of that shadow root.
// To handle this, we monkey-patch the showPopover and hidePopover methods to manually trigger the toggle-function.
// We also bind toggle events to shadow roots found during click events, so that we can listen for toggle events on shadow roots as well.

declare global {
  interface Window {
    _dsPopoverShadows: boolean;
  }
  interface GlobalEventHandlersEventMap {
    'ds-toggle-source': CustomEvent<Element>;
  }
}

const ROOTS = new Map<Node, () => void>();
const ATTR_PLACE = 'data-placement';
const ATTR_AUTO = 'data-autoplacement';
const POPOVERS = new Map<HTMLElement, () => void>();

// Sometimes use "ds-toggle" event while waiting for better support of
// event.source (https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)

const handleToggle = (
  e: Event &
    Partial<ToggleEvent> & { detail?: HTMLElement; source?: HTMLElement },
) => toggle(getComposedTarget(e), e.newState, e.oldState, e.source || e.detail);

function toggle(
  el: Element | null,
  newState?: string,
  oldState?: string,
  source?: HTMLElement,
) {
  const isPopover = el instanceof HTMLElement && attr(el, 'popover') !== null;
  const float = isPopover && getCSSProp(el, '--_ds-floating');

  if (!float) return;
  if (newState === 'closed') return POPOVERS.get(el)?.(); // Cleanup on close
  if (!source) {
    const css = el.id && `[popovertarget="${el.id}"],[commandfor="${el.id}"]`;
    source = (css && getRoot(el).querySelector<HTMLElement>(css)) || undefined; // Polyfill ToggleEvent .source for older browsers
  }
  if (!source || source === el || (oldState && oldState === newState)) return; // No need to update

  // Use scroll-margin-bottom to measure computed arrow-size property as this does
  // not affect layout or position, makes the browser calculate the pixel value instead
  // of returning the calc() (as it would if reading the --_ds-floating-arrow-size directly)
  // and makes it possible to read the value even if ::before is not used to draw the arrow.
  el.style.scrollMarginBottom = `var(--_ds-floating-arrow-size)`;

  const padding = 10;
  const overscroll = getCSSProp(el, '--_ds-floating-overscroll');
  const placement = attr(el, ATTR_PLACE) || attr(source, ATTR_PLACE) || float;
  const auto = attr(el, ATTR_AUTO) || attr(source, ATTR_AUTO);
  const arrowSize = parseFloat(getCSSProp(el, 'scroll-margin-bottom')) || 0;
  const shiftProp = placement.match(/left|right/gi) ? 'Height' : 'Width';
  const shiftLimit = source[`offset${shiftProp}`] / 2 + arrowSize;

  if (placement === 'none') return; // No need to position

  const options = {
    strategy: 'absolute',
    placement,
    middleware: [
      offset(arrowSize),
      shift({
        padding,
        limiter: limitShift({ offset: { mainAxis: shiftLimit } }), // Prevent from shifing away from source
      }),
      arrowPseudo(),
      ...(auto !== 'false' ? [flip({ padding, crossAxis: false })] : []),
      ...(overscroll
        ? [
            size({
              apply({ availableHeight }) {
                if (overscroll === 'fit')
                  el.style.width = `${source.offsetWidth}px`; // Use offsetWidth to include padding, matching the width of the source element
                el.style.maxHeight = `${Math.max(50, availableHeight - padding * 2)}px`;
              },
            }),
          ]
        : []),
    ],
  } as ComputePositionConfig;
  const unfloat = autoUpdate(source, el, async () => {
    if (!source?.isConnected) return POPOVERS.get(el)?.(); // Cleanup if source element is removed
    const { x, y } = await computePosition(source, el, options);
    el.style.translate = `${x}px ${y}px`;
  });
  POPOVERS.set(el, () => POPOVERS.delete(el) && unfloat());
}

// Prevent closing when pointer interacts with scrollbar
let IS_SCROLL: boolean | undefined;
const handleScrollbar = (e: Event) => {
  if (e.type === 'pointerdown') {
    IS_SCROLL = false;
  }
  if (e.type === 'scroll' && IS_SCROLL === false) IS_SCROLL = true;
  if (e.type === 'pointerup' && IS_SCROLL)
    for (const [popover] of POPOVERS) popover.showPopover(); // Immediately show again to prevent flicker
};

// And add listeners for toggle event on shadowRoots as "toggle" is not a composed event
const handleClick = (e: Event) => {
  const root = getRoot(getComposedTarget(e));
  if (root && !ROOTS.has(root))
    ROOTS.set(root, on(root, 'toggle', handleToggle, QUICK_EVENT));
};

// Since toggle event is not composed, we need to trigger it when programatically called inside shadow DOM
if (isBrowser() && !window._dsPopoverShadows) {
  window._dsPopoverShadows = true;
  const togglePopover = HTMLElement.prototype.togglePopover;
  const showPopover = HTMLElement.prototype.showPopover;
  const hidePopover = HTMLElement.prototype.hidePopover;
  HTMLElement.prototype.togglePopover = function (opt) {
    const isOpen = this.matches(':popover-open');
    const isBool = typeof opt === 'boolean';
    const prev = isOpen ? 'open' : 'closed';
    const next = (isBool ? opt : (opt?.force ?? !isOpen)) ? 'open' : 'closed';
    const source = isBool ? undefined : opt?.source;
    const result = togglePopover.call(this, opt as TogglePopoverOptions);
    toggle(this, next, prev, source);
    return result;
  };
  HTMLElement.prototype.showPopover = function (opt) {
    const prev = this.matches(':popover-open') ? 'open' : 'closed';
    const result = showPopover.call(this, opt);
    toggle(this, 'open', prev, opt?.source);
    return result;
  };
  HTMLElement.prototype.hidePopover = function () {
    const prev = this.matches(':popover-open') ? 'open' : 'closed';
    const result = hidePopover.call(this);
    toggle(this, 'closed', prev);
    return result;
  };
}

onHotReload('popover', () => [
  on(document, 'click', handleClick, QUICK_EVENT),
  on(document, 'pointerdown pointerup scroll', handleScrollbar, QUICK_EVENT),
  on(document, 'toggle ds-toggle-source', handleToggle, QUICK_EVENT), // Use capture since the toggle event does not bubble
  () => {
    for (const [, off] of ROOTS) off(); // Cleanup listeners on ShadowRoots on hot reload
    ROOTS.clear();
  },
]);

const arrowPseudo = () => ({
  name: 'arrowPseudo',
  fn(data: MiddlewareState) {
    const target = data.elements.floating;
    const source = data.rects.reference;
    const x = `${Math.round(source.width / 2 + source.x - data.x)}px`;
    const y = `${Math.round(source.height / 2 + source.y - data.y)}px`;

    target.style.setProperty('--_ds-floating-arrow-x', x);
    target.style.setProperty('--_ds-floating-arrow-y', y);
    attr(target, 'data-floating', data.placement);
    return data;
  },
});
