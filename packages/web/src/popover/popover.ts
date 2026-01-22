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
import { attr, on, onHotReload, QUICK_EVENT } from '../utils/utils';

const ATTR_PLACE = 'data-placement';
const ATTR_AUTO = 'data-autoplacement';
const POPOVERS = new Map<HTMLElement, () => void>();

// Sometimes use "ds-toggle" event while waiting for better support of
// event.source (https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)
function handleToggle(
  event: Partial<ToggleEvent> & {
    detail?: HTMLElement;
    source?: HTMLElement;
  },
) {
  const { newState, oldState, target: el, source = event.detail } = event;
  const float = el instanceof HTMLElement && getCSSProp(el, '--_ds-floating');

  if (!float) return;
  if (newState === 'closed') return POPOVERS.get(el)?.(); // Cleanup on close
  if (!source || source === el || (oldState && oldState === newState)) return; // No need to update
  const padding = 10;
  const overscroll = getCSSProp(el, '--_ds-floating-overscroll');
  const placement = attr(el, ATTR_PLACE) || attr(source, ATTR_PLACE) || float;
  const auto = attr(el, ATTR_AUTO) || attr(source, ATTR_AUTO);
  const arrowSize = parseFloat(getComputedStyle(el, '::before').height) || 0;
  const shiftProp = placement.match(/left|right/gi) ? 'Height' : 'Width';
  const shiftLimit = source[`offset${shiftProp}`] / 2 + arrowSize;

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
                  el.style.width = `${source.clientWidth}px`;
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

// Prevent closing when mouse interacts with scrollbar
let IS_SCROLL: boolean | undefined;
const handleScrollbar = ({ type }: Event) => {
  if (type === 'mousedown') IS_SCROLL = false;
  if (type === 'scroll' && IS_SCROLL === false) IS_SCROLL = true;
  if (type === 'mouseup' && IS_SCROLL)
    for (const [popover] of POPOVERS) popover.showPopover(); // Immediately show again to prevent flicker
};

onHotReload('popover', () => [
  on(document, 'mousedown scroll mouseup', handleScrollbar, true),
  on(document, 'toggle ds-toggle-source', handleToggle, QUICK_EVENT), // Use capture since the toggle event does not bubble
]);

const getCSSProp = (el: Element, prop: string) =>
  getComputedStyle(el).getPropertyValue(prop).trim();

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
