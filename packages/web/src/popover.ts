import type { ComputePositionConfig, MiddlewareState } from '@floating-ui/dom';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
} from '@floating-ui/dom';
import { attr, on, onHotReload, QUICK_EVENT } from './utils';

const ATTR_PLACEMENT = 'data-placement';
const ATTR_FLOATING = 'data-floating';
const ATTR_AUTOPLACEMENT = 'data-autoplacement';
const CSS_FLOATING = '--_ds-floating';
const CSS_OVERSCROLL = '--_ds-floating-overscroll';
const POPOVERS = new Map<HTMLElement, () => void>();

// TODO: fix the popover closing animation(?) making closing laggy

// Sometimes use "ds-toggle" event while waiting for better support of
// event.source (https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)
type DSToggleEvent = Partial<ToggleEvent> & {
  detail?: HTMLElement;
  source?: HTMLElement;
};

function handleToggle(event: DSToggleEvent) {
  const { newState, target, source = event.detail } = event;

  if (!isDSFloating(target)) return;
  if (newState === 'closed') return POPOVERS.get(target)?.(); // Cleanup on close
  if (!source || source === target) return; // No need to update
  const padding = 10; // TODO: Make configurable?
  const autoPlacement =
    (attr(target, ATTR_AUTOPLACEMENT) || attr(source, ATTR_AUTOPLACEMENT)) !==
    'false';
  const overscroll = getCSSProp(target, CSS_OVERSCROLL);
  // TODO: Prevent flip through CSS
  const fallbackAxisSideDirection = overscroll ? 'none' : 'start'; // Prevent flipping axis when using overscroll
  const options = {
    strategy: 'absolute',
    placement:
      attr(target, ATTR_PLACEMENT) ||
      attr(source, ATTR_PLACEMENT) ||
      getCSSProp(target, CSS_FLOATING),
    middleware: [
      ...(autoPlacement
        ? [shift({ padding }), flip({ padding, fallbackAxisSideDirection })]
        : []),
      offset(parseFloat(getComputedStyle(target, '::before').height) || 0),
      arrowPseudo(),
      ...(overscroll
        ? [
            size({
              apply({ availableHeight }) {
                if (overscroll === 'fit')
                  target.style.width = `${source.clientWidth}px`;
                target.style.maxHeight = `${Math.max(50, availableHeight - padding * 2)}px`;
              },
            }),
          ]
        : []),
    ],
  } as ComputePositionConfig;
  const unfloat = autoUpdate(source, target, async () => {
    if (!source?.isConnected) return POPOVERS.get(target)?.(); // Cleanup if source element is removed
    const { x, y } = await computePosition(source, target, options);
    target.style.translate = `${x}px ${y}px`;
  });
  POPOVERS.set(target, () => POPOVERS.delete(target) && unfloat());
}

function handleBeforeToggle({ target: el, newState }: Partial<ToggleEvent>) {
  if (newState === 'open' && isDSFloating(el)) attr(el, 'popover', 'manual'); // Make manual to prevent closing when clicking scrollbar
}

// Since we use manual popover, we also manually need to close on outside click
function handleClickOutside({ target: el }: Event) {
  for (const [popover] of POPOVERS)
    if (!popover.contains(el as Node)) {
      const id = popover.id;
      const trigger = `[popovertarget="${id}"],[commandfor="${id}"]`;
      if (!(el as Element)?.closest?.(trigger)) popover.hidePopover();
    }
}

function handleKeydown(event: Partial<KeyboardEvent>) {
  const last = event.key === 'Escape' && Array.from(POPOVERS.keys()).pop();
  if (last) last.hidePopover();
  if (last) event.preventDefault?.(); // Prevent minimize fullscreen Safari
}

onHotReload('popover', () => [
  on(document, 'beforetoggle', handleBeforeToggle, QUICK_EVENT), // Use capture since toggle does not bubble
  on(document, 'click', handleClickOutside, QUICK_EVENT), // Close open popovers on outside click
  on(document, 'keydown', handleKeydown),
  on(document, 'toggle ds-toggle-source', handleToggle, QUICK_EVENT), // Use capture since the toggle event does not bubble
]);

const getCSSProp = (el: Element, prop: string) =>
  getComputedStyle(el).getPropertyValue(prop).trim();

const isDSFloating = (el?: EventTarget | null): el is HTMLElement =>
  el instanceof HTMLElement && !!getCSSProp(el, CSS_FLOATING);

const arrowPseudo = () => ({
  name: 'arrowPseudo',
  fn(data: MiddlewareState) {
    const target = data.elements.floating;
    const source = data.rects.reference;
    const x = `${Math.round(source.width / 2 + source.x - data.x)}px`;
    const y = `${Math.round(source.height / 2 + source.y - data.y)}px`;

    target.style.setProperty('--_dsc-arrow-x', x);
    target.style.setProperty('--_dsc-arrow-y', y);
    attr(target, ATTR_FLOATING, data.placement);
    return data;
  },
});
