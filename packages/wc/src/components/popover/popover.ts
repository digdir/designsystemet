import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  // @ts-expect-error Using CDN during POC
} from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.4/+esm';
import { attr, on, onHotReload, QUICK_EVENT } from '../../utils';

const PLACEMENT = 'data-placement';
const FLOATING = 'data-floating';
const POPOVERS = new Map<HTMLElement, () => void>();

// Sometimes use "ds-toggle" event while waiting for better support of
// event.source (https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent/source)
type DSToggleEvent = Partial<ToggleEvent> & {
  detail?: HTMLElement;
  source?: HTMLElement;
};

const handleToggle = (event: DSToggleEvent) => {
  const { newState, target, source = event.detail } = event;
  if (!isDSFloating(target)) return;
  if (newState === 'closed') return POPOVERS.get(target)?.(); // Cleanup on close
  if (!source || source === target) return; // No need to update
  const options = {
    strategy: 'absolute',
    placement: attr(target, PLACEMENT) || getDSFloating(target),
    middleware: [
      // TODO: data-overscroll="contain" behavior?
      shift(),
      flip({ fallbackAxisSideDirection: 'start' }),
      offset(
        ({ elements: { floating } }: any) =>
          parseFloat(getComputedStyle(floating, '::before').height) || 0,
      ),
      arrowPseudo(),
    ],
  };
  const unfloat = autoUpdate(source, target, async () => {
    if (!source?.isConnected) return POPOVERS.get(target)?.(); // Cleanup if source element is removed
    const { x, y } = await computePosition(source, target, options);
    target.style.translate = `${x}px ${y}px`;
  });
  POPOVERS.set(target, () => POPOVERS.delete(target) && unfloat()); // TODO: Could we use CSS anchor positioning when 'anchorName' in document.documentElement.style?
};

// Make manual to prevent closing when clicking scrollbar
const handleBeforeToggle = ({ target: el, newState }: Partial<ToggleEvent>) =>
  newState === 'open' && isDSFloating(el) && attr(el, 'popover', 'manual');

// Since we use manual popover, we also manually need to close on outside click
const handleClickOutside = ({ target: el }: Event) => {
  for (const [popover] of POPOVERS)
    if (!popover.contains(el as Node)) {
      const id = popover.id;
      const trigger = `button[popovertarget="${id}"],button[commandfor="${id}"]`;
      if (!(el as Element)?.closest?.(trigger)) popover.hidePopover();
    }
};

const handleKeydown = (event: Partial<KeyboardEvent>) => {
  const last = event.key === 'Escape' && Array.from(POPOVERS.keys()).pop();
  if (last) last.hidePopover();
  if (last) event.preventDefault?.(); // Prevent minimize fullscreen Safari
};

onHotReload('floating-popover', () => [
  on(document, 'beforetoggle', handleBeforeToggle, QUICK_EVENT), // Use capture since toggle does not bubble
  on(document, 'click', handleClickOutside, QUICK_EVENT), // Close open popovers on outside click
  on(document, 'keydown', handleKeydown),
  on(document, 'toggle ds-toggle-source', handleToggle, QUICK_EVENT), // Use capture since the toggle event does not bubble
]);

const getDSFloating = (el: Element) =>
  getComputedStyle(el).getPropertyValue('--_ds-is-floating');

const isDSFloating = (el?: EventTarget | null): el is HTMLElement =>
  el instanceof HTMLElement && !!getDSFloating(el);

const arrowPseudo = () => ({
  name: 'arrowPseudo',
  fn(data: any) {
    const target = data.elements.floating;
    const source = data.rects.reference;
    const x = `${Math.round(source.width / 2 + source.x - data.x)}px`;
    const y = `${Math.round(source.height / 2 + source.y - data.y)}px`;

    target.style.setProperty('--_dsc-arrow-x', x);
    target.style.setProperty('--_dsc-arrow-y', y);
    attr(target, FLOATING, data.placement);
    return data;
  },
});
