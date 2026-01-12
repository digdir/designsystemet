import {
  attr,
  customElements,
  DSElement,
  debounce,
  on,
  onMutation,
} from '../../utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-breadcrumbs': DsBreadcrumbsElement;
  }
}

const LABEL = 'data-label';

export class DsBreadcrumbsElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [LABEL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    const handleResize = debounce(() => this.attributeChangedCallback(), 100);
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._unresize = on(window, 'resize', handleResize);
    this._unmutate = onMutation(this, () => this.render(), {
      childList: true,
      subtree: true,
    });

    if (!attr(this, LABEL))
      console.warn(this, `is missing a ${LABEL} attribute`);
  }
  attributeChangedCallback() {
    const first = this._items?.[0];
    const isBackVisible = first?.parentElement === this && first.offsetHeight;
    attr(this, 'aria-label', isBackVisible ? null : attr(this, LABEL)); // Only show aria-label if not showing back link
    attr(this, 'role', isBackVisible ? null : 'navigation');
  }
  disconnectedCallback() {
    this._unresize?.();
    this._unmutate?.();
    this._unresize = this._unmutate = undefined;
  }
  render() {
    for (const item of this._items || []) {
      const parent = item.parentElement;
      const isLastInList = parent !== this && !parent?.nextElementSibling;
      attr(item, 'aria-current', isLastInList ? 'page' : null);
    }
  }
}

customElements.define('ds-breadcrumbs', DsBreadcrumbsElement);
