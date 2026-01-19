import {
  attr,
  attrRequiredWarning,
  isBrowser,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
} from './utils';

let SOURCE: Element | undefined;
let HOVER_TIMER: number | ReturnType<typeof setTimeout> = 0;
let SKIP_TIMER: number | ReturnType<typeof setTimeout> = 0;
const SELECTOR_INTERACTIVE = 'a,button,input,select,textarea,[tabindex]';
const DELAY_HOVER = 300;
const DELAY_SKIP = 300;
const TIP =
  isBrowser() &&
  Object.assign(document.createElement('div'), {
    className: 'ds-tooltip', // TODO: The consumer should be able to provide their own tooltip element
    popover: 'manual',
  });

function handleAriaAttributes() {
  for (const el of document.querySelectorAll('[data-tooltip]')) {
    const hasText = el.textContent?.trim();
    const tooltip = attr(el, 'data-tooltip');

    attr(el, hasText ? 'aria-description' : 'aria-label', tooltip);
    if (!el.matches(SELECTOR_INTERACTIVE))
      attrRequiredWarning(el, 'tabindex="0"');
  }
}

function handleInterest({ type, target }: Event) {
  clearTimeout(HOVER_TIMER);

  if (!TIP || target === TIP) return; // Allow tooltip to be hovered, following https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
  if (type === 'mouseover' && !SOURCE) {
    HOVER_TIMER = setTimeout(handleInterest, DELAY_HOVER, { target }); // Delay mouse showing tooltip if not already shown
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
}

function handleClose(event?: Partial<ToggleEvent>) {
  if (!event) SOURCE = undefined;
  else if (event.target === TIP && event.newState === 'closed')
    SKIP_TIMER = setTimeout(handleClose, DELAY_SKIP);
}

onHotReload('tooltip', () => [
  on(document, 'blur focus mouseover', handleInterest, QUICK_EVENT),
  on(document, 'toggle', handleClose, QUICK_EVENT),
  onMutation(document, handleAriaAttributes, {
    attributeFilter: ['data-tooltip'],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
