import {
  attr,
  attrRequiredWarning,
  customElements,
  DSElement,
  onMutation,
} from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-pagination': DSPaginationElement;
  }
}

const CURRENT = 'data-current';
const HREF = 'data-href';
const LABEL = 'aria-label';
const TOTAL = 'data-total';

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
    return [CURRENT, TOTAL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    attrRequiredWarning(this, LABEL, CURRENT, TOTAL);
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
    const href = attr(this, HREF);
    const { next, prev, pages } = pagination({
      current: parseInt(attr(this, CURRENT) || '1', 10),
      total: parseInt(attr(this, TOTAL) || '10', 10),
      show: items.length - 2,
    });

    items.forEach((item, i) => {
      const page = i ? (items[i + 1] ? pages[i - 1]?.page : next) : prev; // First is prev, last is next
      attr(item, 'aria-current', pages[i - 1]?.current ? 'true' : null);
      attr(item, 'aria-disabled', page ? null : 'true');
      attr(item, 'aria-hidden', page ? null : 'true');
      attr(item, 'data-page', `${page}`);
      attr(item, 'tabindex', page ? null : '-1');
      if (href) attr(item, 'href', href.replace('$page', `${page}`));
    });
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
