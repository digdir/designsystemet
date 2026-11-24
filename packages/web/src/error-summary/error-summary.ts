import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  customElements,
  DSElement,
  getCSSProp,
  getText,
  on,
  onHotReload,
  QUICK_EVENT,
  warn,
} from '../utils/utils';

const CSS_PROP = '--_ds-errorsummary';
const WARN_NAME = `\nAdd a <legend>, or set ${ARIA_LABEL} or ${ARIA_LABELLEDBY} to provide an accessible name for screen readers.`;

const setFocus = (el: HTMLElement | null) => {
  if (el?.nodeName !== 'FIELDSET' || !getCSSProp(el, CSS_PROP)) return false; // Only error summaries have the CSS property
  el.hasAttribute('tabindex') || attr(el, 'tabindex', '-1'); // Respect tabindex set by consumer
  el.focus();

  const name =
    attr(el, ARIA_LABEL)?.trim() ||
    attr(el, ARIA_LABELLEDBY)?.trim() ||
    getText(el.querySelector(':scope > legend'));

  if (!name) warn('Missing accessible name on:', el, WARN_NAME);
  return true;
};

const handleAppear = (e: Event) => setFocus(e.target as HTMLElement);

onHotReload('error-summary', () => {
  for (const el of document.getElementsByTagName('fieldset'))
    if (el.getClientRects().length && setFocus(el)) break; // Focus first visible error summary if animationend fired before this script was loaded
  return [on(document, 'animationend', handleAppear, QUICK_EVENT)]; // Note: animationend event is not composed, so this only works in LightDOM
});

// @deprecated, only kept for backwards compatibility

declare global {
  interface HTMLElementTagNameMap {
    'ds-error-summary': DSErrorSummaryElement;
  }
}

/**
 * @deprecated Use `<fieldset>` with a `<legend>` and the `ds-error-summary` class instead
 */
export class DSErrorSummaryElement extends DSElement {
  connectedCallback() {
    const tag = this.nodeName.toLowerCase(); // Consumer might rename tag, so use dynamic value
    warn(`<${tag}> is deprecated, please use <fieldset> with <legend> instead`);
  }
}

customElements.define('ds-error-summary', DSErrorSummaryElement);
