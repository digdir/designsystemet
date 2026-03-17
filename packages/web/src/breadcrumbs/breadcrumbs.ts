import {
  attr,
  attrOrCSS,
  customElements,
  DSElement,
  debounce,
  on,
  onMutation,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-breadcrumbs': DSBreadcrumbsElement;
  }
}

const ATTR_LABEL = 'aria-label';

export class DSBreadcrumbsElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _label: string | null = null;
  _render?: () => void;
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ATTR_LABEL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    this._label = attrOrCSS(this, ATTR_LABEL); // Cache label for when list is hidden to prevent expensive DOM reads during resize
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._render = debounce(() => render(this), 100); // Debounce render to prevent multiple calls during resize and mutation observer calls
    this._unresize = on(window, 'resize', this._render);
    this._unmutate = onMutation(this, this._render, {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback(_name: string, _prev?: string, next?: string) {
    if (next) this._label = next; // Update cacheed label if aria-label attribute changes
    this._render?.();
  }
  disconnectedCallback() {
    this._unresize?.();
    this._unmutate?.();
    this._unresize = this._unmutate = this._render = this._items = undefined;
  }
}

const render = (self: DSBreadcrumbsElement) => {
  const lastItem = self._items?.[self._items.length - 1];
  const lastItemInList = lastItem?.parentElement === self ? null : lastItem;
  const isListHidden = !lastItemInList?.offsetHeight;

  attr(self, 'role', isListHidden ? null : 'navigation');
  attr(self, ATTR_LABEL, isListHidden ? null : self._label); // Remove aria-label if list is hidden to prevent screen readers from announcing as breadcrumbs

  for (const item of self._items || [])
    attr(item, 'aria-current', item === lastItemInList ? 'page' : null);
};

customElements.define('ds-breadcrumbs', DSBreadcrumbsElement);
