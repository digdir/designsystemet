import '../popover/popover'; // Ensure popover is imported when using individual imports, since tooltip relies on it
import {
  ARIA_DESC,
  ARIA_LABEL,
  announce,
  attr,
  attrOrCSS,
  getComposedTarget,
  getRoot,
  isBrowser,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
  tag,
  warn,
} from '../utils/utils';

let TIP: HTMLElement | undefined;
let TIMER: ReturnType<typeof setTimeout> | undefined;
let TARGET: Element | undefined; // Used to speed up mousemove handling
let OPEN: Element | undefined;
let LAST_HIDE = 0;
const ATTR_COLOR = 'data-color';
const ATTR_SCHEME = 'data-color-scheme';
const ATTR_SIZE = 'data-size';
const ATTR_TOOLTIP = 'data-tooltip';
const DELAY_HOVER = 300;
const DELAY_SKIP = 300;
const IS_IOS = isBrowser() && /iPad|iPhone|iPod/.test(navigator.userAgent); // Needed to omit DELAY_HOVER since iOS triggers mousemove before click
const SELECTOR_COLOR = `[${ATTR_COLOR}]`;
const SELECTOR_SCHEME = `[${ATTR_SCHEME}]`;
const SELECTOR_SIZE = `[${ATTR_SIZE}]`;
const SELECTOR_TOOLTIP = `[${ATTR_TOOLTIP}]`;

/**
 * setTooltipElement
 * @description Allows setting a custom tooltip element. It does not need to, and should not, be injected to document.body, as we inject on hover to ensure React hydration works as expected.
 * @param el The HTMLElement to use as tooltip
 */
export const setTooltipElement = (el?: HTMLElement | null) => {
  if (el && !(el instanceof HTMLElement))
    warn('setTooltipElement expects an HTMLElement, got: ', el);
  hide(); // Reset when changing source
  LAST_HIDE = 0; // Reset last hide time to re-enable delay
  TIP = el || undefined;
};

export const initTooltips = (scope: Element | Document = document) => {
  for (const el of scope.querySelectorAll(SELECTOR_TOOLTIP)) setupText(el);
};

// Initial run has no MutationRecords, so we set records to [null] to ensure we run the querySelectorAll for any existing elements with data-tooltip
const handleMutations = (_: Document, records?: MutationRecord[]) => {
  if (!records) return initTooltips();
  for (const r of records) {
    if (r.target === TIP) continue; // Ignore mutations on tooltip itself
    if (r.attributeName === ATTR_TOOLTIP) setupText(r.target as Element);
    else
      for (const el of r.addedNodes as NodeListOf<Element>) {
        if (el.nodeType !== 1) continue;
        if (el.hasAttribute(ATTR_TOOLTIP)) setupText(el);
        else initTooltips(el); // Check for any child elements with data-tooltip
      }
  }
};

const setupText = (el: Element, canAnnounce = true) => {
  let text = attrOrCSS(el, ATTR_TOOLTIP) || '';

  // Allow using another element as source.
  // Note: Only checks on initial mutation, as we do not want to keep checking if the source element is removed or changed,
  // since this would be a performance issue. If the source element is removed, the tooltip will be empty and not shown.
  if (text[0] === '#')
    text = getRoot(el).getElementById(text.slice(1))?.textContent?.trim() || '';

  if (text !== (el.getAttribute(ARIA_LABEL) || el.getAttribute(ARIA_DESC))) {
    const hasText = attr(el, 'role') !== 'img' && el.textContent?.trim(); // If role="img", ignore text
    attr(el, ATTR_TOOLTIP, text); // Set data-tooltip attribute to speed up future mutations
    attr(el, ARIA_LABEL, hasText ? null : text); // Set aria-label if element does not have text
    attr(el, ARIA_DESC, hasText ? text : null); // Set aria-description if element has text
    if ((el as HTMLElement).tabIndex === -1)
      warn('Missing tabindex="0" attribute on: ', el);
  }
  if (el === OPEN && TIP?.textContent !== text) {
    if (TIP) TIP.textContent = text; // Update tooltip text if it is already open
    if (text && canAnnounce && document.activeElement === el) announce(text); // Only announce if focus is on the source
  }
};

const handleInterest = (e: Event) => {
  const target = getComposedTarget(e);
  if (!target || TARGET === target || TIP?.contains(target as Node)) return; // Same target, or allow tooltip to be hovered (following https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus)
  TARGET = target;

  const source = TARGET?.closest?.(SELECTOR_TOOLTIP) || undefined;
  if (OPEN === source) return; // Same source, no need to update
  if (OPEN) hide(); // Reset previous tooltip, since we are moving to a new source
  OPEN = source;

  if (!source) return; // No source, no need to show tooltip
  if (e.type === 'focus' || IS_IOS || DELAY_SKIP > Date.now() - LAST_HIDE)
    return show(); // Instantly show if focus or if we just closed a tooltip
  if (e.type === 'mousemove') TIMER = setTimeout(show, DELAY_HOVER); // Delay mouse showing tooltip if not already shown
};

const show = () => {
  if (!OPEN) return hide(); // If no new anchor, cleanup previous autoUpdate
  if (!TIP) TIP = tag('div', { class: 'ds-tooltip' });
  if (!TIP.isConnected) document.body.appendChild(TIP);

  const color = OPEN.closest(SELECTOR_COLOR); // Match source color of source element
  const scheme = OPEN.closest(SELECTOR_SCHEME); // Match source color-scheme of source element
  const size = OPEN.closest(SELECTOR_SIZE); // Match source size of source element
  const isReset = color !== scheme && color?.contains(scheme as Node); // If data-scheme is closer to target, it will reset data-color

  attr(TIP, 'popover', 'manual'); // Ensure popover behavior
  attr(TIP, ATTR_SCHEME, scheme?.getAttribute(ATTR_SCHEME) || null); // Fallback to null to reset if not scheme found
  attr(TIP, ATTR_COLOR, (isReset && color?.getAttribute(ATTR_COLOR)) || null); // Fallback to null to reset if not scheme found
  attr(TIP, ATTR_SIZE, size?.getAttribute(ATTR_SIZE) || null); // Fallback to null to reset if not size found
  setupText(OPEN, false); // If mutation observer is not triggered, ensure tooltip text is updated
  TIP.showPopover();
  TIP.dispatchEvent(
    new CustomEvent('ds-toggle-source', {
      bubbles: true,
      composed: true, // Enable bubbling out of shadow DOM boundaries
      detail: OPEN, // Since showPopover({ source }) is not supported in all browsers yet
    }),
  );
};

const hide = (event?: Partial<KeyboardEvent>) => {
  if (event?.type === 'keydown' && event?.key !== 'Escape') return;
  if (OPEN && TIP?.isConnected && TIP.popover) TIP.hidePopover(); // Only hide if connected and activated
  if (!event) LAST_HIDE = Date.now(); // If closing with keyboard, do not show next tooltip instantly
  clearTimeout(TIMER);
  OPEN = undefined;
};

onHotReload('tooltip', () => [
  on(document, 'focus mousemove', handleInterest, QUICK_EVENT),
  on(document, 'keydown', hide, QUICK_EVENT),
  onMutation(document, handleMutations, {
    attributeFilter: [ATTR_TOOLTIP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
