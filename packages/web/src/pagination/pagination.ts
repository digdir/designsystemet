import {
  attr,
  attrRequiredWarning,
  customElements,
  DSElement,
  onMutation,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-pagination': DSPaginationElement;
  }
}

const ATTR_LABEL = 'aria-label';
const ATTR_CURRENT = 'data-current';
const ATTR_TOTAL = 'data-total';
const ATTR_HREF = 'data-href';

// Expose pagination logic if wanting to do custom rendering (i.e. in React/Vue/etc)
export const pagination = ({ current = 1, total = 10, show = 7 }) => ({
  prev: current > 1 ? current - 1 : 0,
  next: current < total ? current + 1 : 0,
  pages: getSteps(current, total, show).map((page, index) => ({
    current: page === current && ('page' as const),
    key: `key-${page}-${index}`,
    page,
  })),
});

export class DSPaginationElement extends DSElement {
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ATTR_CURRENT, ATTR_TOTAL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    attrRequiredWarning(this, ATTR_LABEL);
    if (attr(this, ATTR_TOTAL)) attrRequiredWarning(this, ATTR_CURRENT);
    if (attr(this, ATTR_CURRENT)) attrRequiredWarning(this, ATTR_TOTAL);

    this._unmutate = onMutation(this, this.render.bind(this), {
      childList: true,
      subtree: true,
    });
  }
  disconnectedCallback() {
    this._unmutate?.();
    this._unmutate = undefined;
  }
  render() {
    const items = this.querySelectorAll('button,a');
    const href = attr(this, ATTR_HREF);
    const current = Number(attr(this, ATTR_CURRENT));
    const total = Number(attr(this, ATTR_TOTAL));
    const show = items.length - 2;

    if (current && total) {
      const { next, prev, pages } = pagination({ current, total, show });
      items.forEach((item, i) => {
        const page = i ? (items[i + 1] ? pages[i - 1]?.page : next) : prev; // First is prev, last is next
        attr(item, 'aria-current', pages[i - 1]?.current ? 'true' : null);
        attr(item, 'aria-hidden', page ? null : 'true');
        attr(item, 'data-page', `${page}`);
        attr(item, 'role', page ? null : 'none'); // Prevent validation errors for aria-hidden buttons
        attr(item, 'tabindex', page ? null : '-1');
        if (item instanceof HTMLButtonElement) attr(item, 'value', `${page}`);
        if (href) attr(item, 'href', href.replace('$page', `${page}`));
      });
    }
  }
}

customElements.define('ds-pagination', DSPaginationElement);

function getSteps(now: number, max: number, show = Number.POSITIVE_INFINITY) {
  const offset = (show - 1) / 2;
  const start = Math.max(Math.min(now - Math.floor(offset), max - show + 1), 1);
  const end = Math.min(Math.max(now + Math.ceil(offset), show), max);
  const pages = Array.from({ length: end + 1 - start }, (_, i) => i + start);

  if (show > 4 && start > 1) pages.splice(0, 2, 1, 0);
  if (show > 3 && end < max) pages.splice(-2, 2, 0, max);
  return pages;
}
