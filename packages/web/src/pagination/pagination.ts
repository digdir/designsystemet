import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  attrOrCSS,
  customElements,
  DSElement,
  onMutation,
  warn,
} from '../utils/utils';
import { pagination } from './pagination-helper';

declare global {
  interface HTMLElementTagNameMap {
    'ds-pagination': DSPaginationElement;
  }
}

const ATTR_CURRENT = 'data-current';
const ATTR_TOTAL = 'data-total';
const ATTR_HREF = 'data-href';

export class DSPaginationElement extends DSElement {
  _unmutate?: () => void; // Using underscore instead of private fields for backwards compatibility
  _render?: () => void;

  static get observedAttributes() {
    return [ARIA_LABEL, ARIA_LABELLEDBY, ATTR_CURRENT, ATTR_TOTAL, ATTR_HREF]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    // Check for required attributes
    const total = attr(this, ATTR_TOTAL);
    const current = attr(this, ATTR_CURRENT);
    if (current && !total) warn(`Missing ${ATTR_TOTAL} attribute on:`, this);
    if (total && !current) warn(`Missing ${ATTR_CURRENT} attribute on:`, this);

    const label = attrOrCSS(this, ARIA_LABEL);
    const labelledby = attr(this, ARIA_LABELLEDBY)?.trim();
    if (label || labelledby) attr(this, ARIA_LABEL, labelledby ? null : label);
    else warn(`Missing ${ARIA_LABEL} on:`, this);

    attr(this, 'role', 'navigation');
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback() {
    if (this._unmutate) render(this); // Ensure we do not run any renders before connectedCallback
  }
  disconnectedCallback() {
    this._unmutate?.();
    this._unmutate = this._render = undefined;
  }
}

const isNamedByAriaLabel = (el: Element) =>
  !el.textContent?.trim() && !attr(el, ARIA_LABELLEDBY);

const render = (self: DSPaginationElement) => {
  const current = Number(attr(self, ATTR_CURRENT));
  const total = Number(attr(self, ATTR_TOTAL));

  // Allowing server side generated pagination, buy only doing client side updates if total/current attributes are provided
  if (current && total) {
    const items = self.querySelectorAll('button,a');
    const show = items.length - 2;
    const href = attr(self, ATTR_HREF);
    const { next, prev, pages } = pagination({ current, total, show });
    items.forEach((item, i) => {
      const isStep = i !== 0 && !!items[i + 1]; // First is prev, last is next
      const page = isStep ? pages[i - 1]?.page : i ? next : prev;
      attr(item, 'aria-current', pages[i - 1]?.current ? 'true' : null);
      attr(item, 'hidden', page ? null : '');

      if (isStep) {
        // Also drives CSS content, hides items without a page, and keeps Axe and the VoiceOver rotor happy
        attr(item, ARIA_LABEL, page ? `${page}` : null);
      } else if (isNamedByAriaLabel(item)) {
        // If prev/next is not named by consumer fallback to CSS-variable in Norwegian
        attr(item, ARIA_LABEL, attrOrCSS(item, ARIA_LABEL));
      }

      if (item instanceof HTMLButtonElement) attr(item, 'value', `${page}`);
      if (href && item instanceof HTMLAnchorElement)
        attr(item, 'href', href.replace('%d', `${page}`));
    });
  }
};

customElements.define('ds-pagination', DSPaginationElement);
