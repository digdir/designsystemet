import '../popover/popover'; // Ensure popover is imported when using individual imports, since tooltip relies on it
import {
  ARIA_DESC,
  ARIA_LABEL,
  announce,
  attr,
  attrOrCSS,
  getComposedTarget,
  getRoot,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
  tag,
  warn,
} from '../utils/utils';

let TIP: HTMLElement | undefined;
let TARGET: Element | undefined; // Used to speed up mousemove handling
let SOURCE: Element | undefined;
let TIMER: ReturnType<typeof setTimeout> | undefined;
let LAST_HIDE = 0;
const ATTR_COLOR = 'data-color';
const ATTR_SCHEME = 'data-color-scheme';
const ATTR_TOOLTIP = 'data-tooltip';
const SELECTOR_COLOR = `[${ATTR_COLOR}]`;
const SELECTOR_INTERACTIVE = 'a,button,input,label,select,textarea,[tabindex]';
const SELECTOR_SCHEME = `[${ATTR_SCHEME}]`;
const SELECTOR_TOOLTIP = `[${ATTR_TOOLTIP}]`;
const DELAY_HOVER = 300;
const DELAY_SKIP = 300;

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

// Initial run has no MutationRecords, so we set records to [null] to ensure we run the querySelectorAll for any existing elements with data-tooltip
const handleMutations = (_: Document, records?: MutationRecord[]) => {
  for (const r of records || [null]) {
    if (r?.target === TIP) continue; // Ignore mutations on tooltip itself
    if (r?.attributeName === ATTR_TOOLTIP) setupText(r.target as Element);
    else if (!r || r.addedNodes.length) {
      const scope = (r?.target || document) as Element;
      for (const el of scope.querySelectorAll(SELECTOR_TOOLTIP)) setupText(el);
    }
  }
};

const setupText = (el: Element, canAnnounce = true) => {
  let text = attrOrCSS(el, ATTR_TOOLTIP);

  // Allow using another element as source.
  // Note: Only checks on initial mutation, as we do not want to keep checking if the source element is removed or changed,
  // since this would be a performance issue. If the source element is removed, the tooltip will be empty and not shown.
  if (text?.[0] === '#')
    text =
      getRoot(el).getElementById(text.slice(1))?.textContent?.trim() || null;

  if (!text) return text; // Early return if no tooltip text
  if (text !== (el.getAttribute(ARIA_LABEL) || el.getAttribute(ARIA_DESC))) {
    const hasText = attr(el, 'role') !== 'img' && el.textContent?.trim(); // If role="img", ignore text
    attr(el, ATTR_TOOLTIP, text); // Set data-tooltip attribute to speed up future mutations
    attr(el, ARIA_LABEL, hasText ? null : text); // Set aria-label if element does not have text
    attr(el, ARIA_DESC, hasText ? text : null); // Set aria-description if element has text
    if (!el.matches(SELECTOR_INTERACTIVE))
      warn('Missing tabindex="0" attribute on: ', el);
  }
  if (el === SOURCE && text && TIP?.textContent !== text) {
    if (TIP) TIP.textContent = text;
    if (canAnnounce && document.activeElement === el) announce(text); // Only announce if focus is on the source
  }
};

const handleInterest = (e: Event) => {
  const target = getComposedTarget(e);
  if (!target || TARGET === target || TIP?.contains(target as Node)) return; // Same target, or allow tooltip to be hovered (following https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus)
  TARGET = target;

  const source = TARGET?.closest?.(SELECTOR_TOOLTIP) || undefined;
  if (SOURCE === source) return; // Same source, no need to update
  if (SOURCE) hide(); // Reset previous tooltip, since we are moving to a new source
  SOURCE = source;

  if (!source) return; // No source, no need to show tooltip
  if (e.type === 'focus' || DELAY_SKIP > Date.now() - LAST_HIDE) return show(); // Instantly show if focus or if we just closed a tooltip
  if (e.type === 'mousemove') TIMER = setTimeout(show, DELAY_HOVER); // Delay mouse showing tooltip if not already shown
};

const show = () => {
  if (!SOURCE) return hide(); // If no new anchor, cleanup previous autoUpdate
  if (!TIP) TIP = tag('div', { class: 'ds-tooltip' });
  if (!TIP.isConnected) document.body.appendChild(TIP);

  const color = SOURCE.closest(SELECTOR_COLOR); // Match source color of source element
  const scheme = SOURCE.closest(SELECTOR_SCHEME); // Match source color-scheme of source element
  const isReset = color !== scheme && color?.contains(scheme as Node); // If data-scheme is closer to target, it will reset data-color

  attr(TIP, 'popover', 'manual'); // Ensure popover behavior
  attr(TIP, ATTR_SCHEME, scheme?.getAttribute(ATTR_SCHEME) || null); // Fallback to null to reset if not scheme found
  attr(TIP, ATTR_COLOR, (isReset && color?.getAttribute(ATTR_COLOR)) || null); // Fallback to null to reset if not scheme found
  setupText(SOURCE, false); // If mutation observer is not triggered, ensure tooltip text is updated
  // TIP.textContent = attr(SOURCE, ATTR_TOOLTIP);
  TIP.showPopover();
  TIP.dispatchEvent(
    new CustomEvent('ds-toggle-source', {
      bubbles: true,
      composed: true, // Enable bubbling out of shadow DOM boundries
      detail: SOURCE, // Since showPopover({ source }) is not supported in all browsers yet
    }),
  );
};

const hide = (event?: Partial<KeyboardEvent>) => {
  if (event?.type === 'keydown' && event?.key !== 'Escape') return;
  if (SOURCE && TIP?.isConnected && TIP.popover) TIP.hidePopover(); // Only hide if connected and activated
  if (!event) LAST_HIDE = Date.now(); // If closing with keyboard, do not show next tooltip instantly
  clearTimeout(TIMER);
  SOURCE = undefined;
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
