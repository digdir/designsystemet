import {
  attr,
  isBrowser,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
} from '../../utils';

let SOURCE: Element | undefined;
let HOVER_TIMER: number | ReturnType<typeof setTimeout> = 0;
let SKIP_TIMER: number | ReturnType<typeof setTimeout> = 0;
const HOVER_DELAY = 300;
const SKIP_DELAY = 300;
const TIP =
  isBrowser() &&
  Object.assign(document.createElement('div'), {
    className: 'ds-tooltip', // TODO: Should the the consumer be able to add their own tooltip element, for more flexibility?
    popover: 'manual',
  });

const handleAriaAttributes = () => {
  for (const el of document.querySelectorAll('[data-tooltip]')) {
    const hasText = el.textContent?.trim();
    const tooltip = attr(el, 'data-tooltip');
    attr(el, hasText ? 'aria-description' : 'aria-label', tooltip); // TODO: Warn if non-interactive element lacks tabindex="0"?
  }
};

const handleInterest = ({ type, target }: Event) => {
  clearTimeout(HOVER_TIMER);

  if (!TIP || target === TIP) return; // Allow tooltip to be hovered, following https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
  if (type === 'mouseover' && !SOURCE) {
    HOVER_TIMER = setTimeout(handleInterest, HOVER_DELAY, { target }); // Delay mouse showing tooltip if not already shown
    return;
  }

  const source = (target as Element)?.closest?.('[data-tooltip]');
  if (source === SOURCE) return; // No need to update
  if (!source) return TIP?.hidePopover(); // If no new anchor, cleanup previous autoUpdate
  if (!TIP.isConnected) document.body.appendChild(TIP); // Ensure connected

  clearTimeout(SKIP_TIMER);
  TIP.textContent = attr(source, 'data-tooltip');
  TIP.showPopover();
  TIP.dispatchEvent(new CustomEvent('ds-toggle-source', { detail: source })); // Since showPopover({ source }) is not supported in all browsers yet
  SOURCE = source;
};

const handleClose = (event?: Partial<ToggleEvent>) => {
  if (!event) SOURCE = undefined;
  else if (event.target === TIP && event.newState === 'closed')
    SKIP_TIMER = setTimeout(handleClose, SKIP_DELAY);
};

onHotReload('tooltip', () => [
  on(document, 'blur focus mouseover', handleInterest, QUICK_EVENT),
  on(document, 'toggle', handleClose, QUICK_EVENT),
  onMutation(document.body, handleAriaAttributes, {
    attributeFilter: ['data-tooltip'],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
