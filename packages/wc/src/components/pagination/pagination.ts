import { attr, customElements, DSElement, onMutation } from '../../utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-pagination': DsPaginationElement;
  }
}

const CURRENT = 'data-current';
const TOTAL = 'data-total';

export const pagination = ({ current = 1, total = 10, show = 7 }) => ({
  prev: current > 1 ? current - 1 : 0,
  next: current < total ? current + 1 : 0,
  pages: getSteps(current, total, show).map((page, index) => ({
    current: page === current && ('page' as const),
    key: `key-${page}-${index}`,
    page,
  })),
});

export class DsPaginationElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _unmutate?: () => void;

  static get observedAttributes() {
    return [CURRENT, TOTAL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._unmutate = onMutation(this, () => this.render(), {
      childList: true,
      subtree: true,
    });

    if (!attr(this, CURRENT))
      console.warn(this, `is missing a ${CURRENT} attribute`);
    if (!attr(this, TOTAL))
      console.warn(this, `is missing a ${TOTAL} attribute`);
  }
  disconnectedCallback() {
    this._unmutate?.();
    this._unmutate = undefined;
  }
  render() {
    const { next, prev, pages } = pagination({
      current: parseInt(attr(this, CURRENT) || '1', 10),
      total: parseInt(attr(this, TOTAL) || '10', 10),
      show: this._items?.length || 7,
    });
    console.log(next, prev, pages);
  }
}

customElements.define('ds-pagination', DsPaginationElement);

function getSteps(now: number, max: number, show = Number.POSITIVE_INFINITY) {
  const offset = (show - 1) / 2;
  const start = Math.max(Math.min(now - Math.floor(offset), max - show + 1), 1);
  const end = Math.min(Math.max(now + Math.ceil(offset), show), max);
  const pages = Array.from({ length: end + 1 - start }, (_, i) => i + start);

  if (show > 4 && start > 1) pages.splice(0, 2, 1, 0);
  if (show > 3 && end < max) pages.splice(-2, 2, 0, max);
  return pages;
}
