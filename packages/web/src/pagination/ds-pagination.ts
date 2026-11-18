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
import { pagination } from './pagination';

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

const render = (self: DSPaginationElement) => {
  const current = Number(attr(self, ATTR_CURRENT));
  const total = Number(attr(self, ATTR_TOTAL));

  // Allowing server side generated pagination, buy only doing client side updates if total/current attributes are provided
  if (current && total) {
    const items = self.querySelectorAll('button,a');
    const href = attr(self, ATTR_HREF);
    const show = items.length - 2;
    const { next, prev, pages } = pagination({ current, total, show });

    items.forEach((el, idx) => {
      const isLink = href && el.nodeName === 'A';
      const isEdge = idx === 0 || !items[idx + 1]; // First is prev, last is next
      const page = isEdge ? (idx ? next : prev) : pages[idx - 1];
      const value = page?.value ? `${page?.value}` : null;

      attr(el, 'aria-current', page?.['aria-current'] || null);
      attr(el, 'inert', page?.inert ? '' : null); // Inert if ellipsis
      attr(el, 'hidden', page ? null : ''); // Completely hide when not a page

      if (!isEdge) attr(el, ARIA_LABEL, value);
      else if (!attr(el, ARIA_LABELLEDBY) && !el.textContent?.trim())
        attr(el, ARIA_LABEL, attrOrCSS(el, ARIA_LABEL)); // If prev/next is not named by consumer fallback to CSS-variable in Norwegian

      if (isLink) attr(el, 'href', href.replace('%d', value || '#'));
      attr(el, 'value', el.nodeName === 'BUTTON' ? value : null);
    });
  }
};

customElements.define('ds-pagination', DSPaginationElement);
