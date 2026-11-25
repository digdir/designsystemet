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

if (isBrowser() && !isSupported() && !isPolyfilled()) {
  polyfillPopover({ layerName: 'ds.base' }); // Load popover polyfill in the ds.base CSS layer to keep cascade order consistent with Designsystemet layers.
}

// NOTE:
// The native popover events "beforetoggle" and "toggle" are not composed, meaning they do not bubble out of shadow DOM.
// This means that if a popover is inside a shadow root, these events will not be visible outside of that shadow root.
// To handle this, we monkey-patch the showPopover and hidePopover methods to manually trigger the toggle-function.
// We also bind beforetoggle and toggle events to shadow roots found during click events, so that we can listen for them on shadow roots as well.

declare global {
  interface GlobalEventHandlersEventMap {
    'ds-toggle-source': CustomEvent<Element>;
  }
}

const ROOTS = new Map<ShadowRoot, () => void>();
const ATTR_PLACE = 'data-placement';
const ATTR_AUTO = 'data-autoplacement';
const POPOVERS = new Map<
  HTMLElement,
  { source: Element; cleanup: () => void }
>();

// Sometimes use "ds-toggle" event while waiting for better support of
// event.source (https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)

const handleToggle = (
  e: Event &
    Partial<ToggleEvent> & { detail?: HTMLElement; source?: HTMLElement },
) => toggle(getComposedTarget(e), e.newState, e.oldState, e.source || e.detail);

// The "toggle" event is a queued task, so the browser can paint a popover opened
// by popovertarget or commandfor before it is positioned. "beforetoggle" fires
// before the popover opens, and an animation frame runs after it opens but
// before it is painted.
const handleBeforeToggle = (
  e: Event & Partial<ToggleEvent> & { source?: HTMLElement },
) => {
  const el = getComposedTarget(e);
  const source = e.source; // Read while dispatching, since a source in shadow DOM is retargeted to its host afterwards
  if (e.newState === 'open' && el)
    requestAnimationFrame(() => {
      if (!POPOVERS.has(el as HTMLElement) && el.matches(':popover-open'))
        toggle(el, 'open', 'closed', source);
    });
};

function toggle(
  el: Element | null,
  newState?: string,
  oldState?: string,
  source?: HTMLElement,
) {
  const isPopover = el instanceof HTMLElement && attr(el, 'popover') !== null;
  const prev = POPOVERS.get(el as HTMLElement);

  if (newState === 'open' && oldState === newState) return; // Keep existing positioning for a no-op open
  if (newState === 'open' && prev && prev.source === source) return; // Prevent double binding
  prev?.cleanup(); // Cleanup if previously bound popover exists to avoid multiple autoUpdate memory leaks
  if (newState === 'closed' || !isPopover) return;
  if (!source) {
    const css = el.id && `[popovertarget="${el.id}"],[commandfor="${el.id}"]`;
    source = (css && getRoot(el).querySelector<HTMLElement>(css)) || undefined; // Polyfill ToggleEvent .source for older browsers
  }
  if (!source || source === el) return; // No need to update
  const dsFloating = getCSSProp(el, '--_ds-floating');
  const attrPlacement = attr(el, ATTR_PLACE) ?? attr(source, ATTR_PLACE);

  if (attrPlacement === null && !dsFloating) return; // Only take control if --_ds-floating or data-placement attributes is set

  // Use scroll-margin-bottom to measure computed arrow-size property as this does
  // not affect layout or position, makes the browser calculate the pixel value instead
  // of returning the calc() (as it would if reading the --_ds-floating-arrow-size directly)
  // and makes it possible to read the value even if ::before is not used to draw the arrow.
  el.style.scrollMarginBottom = `var(--_ds-floating-arrow-size)`;

  const padding = 10;
  const placement = attrPlacement || dsFloating || 'top';
  const overscroll = getCSSProp(el, '--_ds-floating-overscroll');
  const auto = attr(el, ATTR_AUTO) || attr(source, ATTR_AUTO);
  const arrowSize = parseFloat(getCSSProp(el, 'scroll-margin-bottom')) || 0;
  const shiftProp = placement.match(/left|right/gi) ? 'Height' : 'Width';
  const shiftLimit = source[`offset${shiftProp}`] / 2 + arrowSize;

  if (placement === 'none') return; // No need to position

  let sized = false; // Only set maxHeight once per open, so scrolling does not resize the popover
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
                if (sized) return;
                sized = true;
                const maxHeight = `${Math.max(50, availableHeight - padding * 2)}px`;

                requestAnimationFrame(() => {
                  // Avoid changing an observed element during ResizeObserver delivery.
                  if (el.style.maxHeight !== maxHeight)
                    el.style.maxHeight = maxHeight;
                });
              },
            }),
          ]
        : []),
    ],
  } as ComputePositionConfig;
  const unfloat = autoUpdate(source, el, async () => {
    if (!source?.isConnected) return POPOVERS.get(el)?.cleanup(); // Cleanup if source element is removed
    // Match the width before measuring, so the position is computed from the
    // final size and el.style.translate reveals an already correctly sized
    // popover. Unlike maxHeight this does not depend on the available space,
    // so it is safe to keep in sync on every update rather than sizing once.
    if (overscroll === 'fit') {
      const width = `${source.offsetWidth}px`; // Use offsetWidth to include padding, matching the width of the source element
      if (el.style.width !== width) el.style.width = width;
    }
    const { x, y } = await computePosition(source, el, options);
    el.style.translate = `${x}px ${y}px`;
  });
  POPOVERS.set(el, {
    source,
    cleanup: () => POPOVERS.delete(el) && unfloat(),
  });
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

// And add listeners for beforetoggle and toggle events on shadowRoots as they are not composed events
const handleClick = (e: Event) => {
  for (const [root, off] of ROOTS)
    if (!root.host?.isConnected && ROOTS.delete(root)) off(); // Prune roots whose host is no longer connected (e.g. removed custom elements) to avoid unbounded growth

  const root = getRoot(getComposedTarget(e));
  if (root instanceof ShadowRoot && !ROOTS.has(root)) {
    const offToggle = on(root, 'toggle', handleToggle, QUICK_EVENT);
    const offBeforeToggle = on(
      root,
      'beforetoggle',
      handleBeforeToggle,
      QUICK_EVENT,
    );
    ROOTS.set(root, () => {
      offToggle();
      offBeforeToggle();
    });
  }
};

onHotReload('popover', () => {
  const descriptors = Object.getOwnPropertyDescriptors(HTMLElement.prototype);
  const togglePopover = HTMLElement.prototype.togglePopover;
  const showPopover = HTMLElement.prototype.showPopover;
  const hidePopover = HTMLElement.prototype.hidePopover;

  // Since toggle event is not composed, we need to trigger it when programatically called inside shadow DOM
  Object.defineProperties(HTMLElement.prototype, {
    togglePopover: {
      ...descriptors.togglePopover,
      value(opt: TogglePopoverOptions) {
        const isOpen = this.matches(':popover-open');
        const isBool = typeof opt === 'boolean';
        const prev = isOpen ? 'open' : 'closed';
        const next = (isBool ? opt : (opt?.force ?? !isOpen))
          ? 'open'
          : 'closed';
        const source = isBool ? undefined : opt?.source;
        const result = togglePopover?.call(this, opt as TogglePopoverOptions);
        toggle(this, next, prev, source);
        return result;
      },
    },
    showPopover: {
      ...descriptors.showPopover,
      value(opt: ShowPopoverOptions) {
        const prev = this.matches(':popover-open') ? 'open' : 'closed';
        const result = showPopover?.call(this, opt);
        toggle(this, 'open', prev, opt?.source);
        return result;
      },
    },
    hidePopover: {
      ...descriptors.hidePopover,
      value() {
        const prev = this.matches(':popover-open') ? 'open' : 'closed';
        const result = hidePopover?.call(this);
        toggle(this, 'closed', prev);
        return result;
      },
    },
  });

  return [
    on(document, 'click', handleClick, QUICK_EVENT),
    on(document, 'pointerdown pointerup scroll', handleScrollbar, QUICK_EVENT),
    on(document, 'toggle ds-toggle-source', handleToggle, QUICK_EVENT), // Use capture since the toggle event does not bubble
    on(document, 'beforetoggle', handleBeforeToggle, QUICK_EVENT), // Use capture since the beforetoggle event does not bubble either
    () => {
      // Restore original methods on hot reload
      Object.defineProperties(HTMLElement.prototype, {
        togglePopover: { ...descriptors.togglePopover, value: togglePopover },
        showPopover: { ...descriptors.showPopover, value: showPopover },
        hidePopover: { ...descriptors.hidePopover, value: hidePopover },
      });
      for (const [, off] of ROOTS) off(); // Cleanup listeners on ShadowRoots on hot reload
      ROOTS.clear();
    },
  ];
});

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
