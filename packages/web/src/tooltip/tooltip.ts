import {
  announce,
  attr,
  attrOrCSS,
  isBrowser,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
  tag,
  warn,
} from '../utils/utils';

let TIP: HTMLElement | undefined;
let SOURCE: Element | undefined;
let HOVER_TIMER: number | ReturnType<typeof setTimeout> = 0;
let SKIP_TIMER: number | ReturnType<typeof setTimeout> = 0;
const IS_IOS = isBrowser() && /iPad|iPhone|iPod/.test(navigator.userAgent); // Needed to omit DELAY_HOVER since iOS triggers mouseover before click
const ATTR_TOOLTIP = 'data-tooltip';
const ATTR_COLOR = 'data-color';
const ARIA_LABEL = 'aria-label';
const ARIA_DESC = 'aria-description';
const SELECTOR_COLOR = `[${ATTR_COLOR}]`;
const SELECTOR_TOOLTIP = `[${ATTR_TOOLTIP}]`;
const ATTR_SCHEME = 'data-color-scheme';
const SELECTOR_SCHEME = `[${ATTR_SCHEME}]`;
const SELECTOR_INTERACTIVE = 'a,button,input,label,select,textarea,[tabindex]';
const DELAY_HOVER = 300;
const DELAY_SKIP = 300;

// Check if the tooltip popover is currently visible.
// Uses :popover-open in supporting browsers, falls back to offset dimensions for JSDOM.
const isTipOpen = () => {
  if (!TIP?.isConnected) return false;
  try {
    return TIP.matches(':popover-open');
  } catch {
    return !!(TIP.offsetHeight && TIP.offsetWidth); // :popover-open may not be supported (e.g. JSDOM) - fall through to offset check
  }
};

/**
 * setTooltipElement
 * @description Allows setting a custom tooltip element. It does not need to, and should not, be injected to document.body, as we inject on hover to ensure React hydration works as expected.
 * @param el The HTMLElement to use as tooltip
 */
export const setTooltipElement = (el?: HTMLElement | null) => {
  if (el && !(el instanceof HTMLElement))
    warn('setTooltipElement expects an HTMLElement, got: ', el);
  hideTooltip(); // Ensure any existing open tooltip is closed before swapping reference
  TIP = el || undefined;
};

const handleAriaAttributes = () => {
  if (SOURCE && !SOURCE.isConnected) hideTooltip(); // If the current SOURCE has been removed from the DOM, hide the stale tooltip

  for (const el of document.querySelectorAll(SELECTOR_TOOLTIP)) {
    const text = attrOrCSS(el, ATTR_TOOLTIP);

    if (!text) continue; // Skip elements with no tooltip text, but continue iterating
    if (text !== (el.getAttribute(ARIA_LABEL) || el.getAttribute(ARIA_DESC))) {
      const hasText = attr(el, 'role') !== 'img' && el.textContent?.trim(); // If role="img", ignore text
      attr(el, ATTR_TOOLTIP, text); // Set data-tooltip attribute to speed up future mutations
      attr(el, ARIA_LABEL, hasText ? null : text); // Set aria-label if element does not have text
      attr(el, ARIA_DESC, hasText ? text : null); // Set aria-description if element has text
      if (!el.matches(SELECTOR_INTERACTIVE))
        warn('Missing tabindex="0" attribute on: ', el);
    }

    // If an existing tooltip has changed programmatically, update tooltip text and announce change
    const isChanged = el === SOURCE && isTipOpen() && TIP?.textContent !== text; // Only update if mutation is on source element and tooltip is open to avoid unnecessary updates
    if (isChanged) {
      if (TIP) TIP.textContent = text;
      if (document.activeElement === el) announce(text); // Only announce if focus is on the button
    }
  }
};

const handleInterest = (event: Event) => {
  const { type, target } = event;
  clearTimeout(HOVER_TIMER);

  if (target === TIP) return; // Allow tooltip to be hovered, following https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
  if (type === 'blur' || type === 'mouseout') return hideTooltip();
  if (type === 'mouseover' && !SOURCE && !IS_IOS) {
    HOVER_TIMER = setTimeout(handleInterest, DELAY_HOVER, { target }); // Delay mouse showing tooltip if not already shown
    return;
  }

  const source = (target as Element)?.closest?.(`[${ATTR_TOOLTIP}]`);

  // Defensive: if SOURCE references a detached node, clear it before short-circuit
  if (SOURCE && !SOURCE.isConnected) hideTooltip();

  if (source && source === SOURCE) return; // No need to update
  if (!source) return hideTooltip(); // If no new anchor, cleanup previous autoUpdate
  if (!TIP) TIP = tag('div', { class: 'ds-tooltip' });
  if (!TIP.isConnected) document.body.appendChild(TIP); // Ensure connected

  const color = source.closest(SELECTOR_COLOR); // Match source color of source element
  const scheme = source.closest(SELECTOR_SCHEME); // Match source color-scheme of source element
  const isReset = color !== scheme && color?.contains(scheme as Node); // If data-scheme is closer to target, it will reset data-color

  clearTimeout(SKIP_TIMER);
  attr(TIP, 'popover', 'manual'); // Ensure popover behavior
  attr(TIP, ATTR_SCHEME, scheme?.getAttribute(ATTR_SCHEME) || null); // Fallback to null to reset if not scheme found
  attr(TIP, ATTR_COLOR, (isReset && color?.getAttribute(ATTR_COLOR)) || null); // Fallback to null to reset if not scheme found
  TIP.textContent = attr(source, ATTR_TOOLTIP);

  // showPopover throws InvalidStateError if popover is already open.
  // When switching sources we keep TIP open and just update content/anchor.
  if (!isTipOpen()) {
    try {
      TIP.showPopover();
    } catch {
      // Already open, detached, or popover API not yet supported - safe to ignore
    }
  }
  TIP.dispatchEvent(new CustomEvent('ds-toggle-source', { detail: source })); // Since showPopover({ source }) is not supported in all browsers yet
  SOURCE = source;
};

const hideTooltip = () => {
  clearTimeout(SKIP_TIMER); // Clear any pending skip timer so overlapping toggle cycles don't leak timers
  clearTimeout(HOVER_TIMER); // Clear any pending delayed show
  if (TIP?.isConnected && TIP.popover) {
    try {
      TIP.hidePopover();
    } catch {
      // Popover may have already been closed by another path - ignore
    }
  }
  SOURCE = undefined; // Cleanup
};

const handleClose = (event?: Partial<ToggleEvent & KeyboardEvent>) => {
  clearTimeout(SKIP_TIMER); // Ensure previous pending timer is cleared before scheduling a new one
  if (event?.type === 'keydown' && event?.key === 'Escape') hideTooltip();
  if (event?.target === TIP && event?.newState === 'closed')
    SKIP_TIMER = setTimeout(hideTooltip, DELAY_SKIP);
};

onHotReload('tooltip', () => [
  on(document, 'blur focus mouseover mouseout', handleInterest, QUICK_EVENT),
  on(document, 'toggle keydown', handleClose, QUICK_EVENT),
  onMutation(document, handleAriaAttributes, {
    attributeFilter: [ATTR_TOOLTIP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
