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
const ATTR_LABEL_HIDDEN = 'data-label'; // Used to hide label on mobile when only showing back link

export class DSBreadcrumbsElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _render?: () => void;
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ATTR_LABEL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    // aria-label can already have been hidden by attributeChangedCallback
    if (!attr(this, ATTR_LABEL_HIDDEN)) attrOrCSS(this, ATTR_LABEL);
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._render = debounce(() => render(this), 100); // Debounce render to prevent multiple calls during resize and mutation observer calls
    this._unresize = on(window, 'resize', this._render);
    this._unmutate = onMutation(this, this._render, {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback() {
    this._render?.();
  }
  disconnectedCallback() {
    this._unresize?.();
    this._unmutate?.();
    this._unresize = this._unmutate = this._render = this._items = undefined;
  }
}

const render = (self: DSBreadcrumbsElement) => {
  const last = self._items?.[self._items.length - 1];
  const lastInList = last?.parentElement === self ? null : last;
  const isListHidden = !lastInList?.offsetHeight;
  const labelHidden = attr(self, ATTR_LABEL_HIDDEN);
  const label = attr(self, ATTR_LABEL);

  // Only update labels if needed to prevent infinite attribute update loop
  attr(self, 'role', isListHidden ? null : 'navigation');
  if (!isListHidden && !label && labelHidden)
    attr(self, ATTR_LABEL, labelHidden);
  else if (isListHidden && label) {
    attr(self, ATTR_LABEL_HIDDEN, label);
    attr(self, ATTR_LABEL, null);
  }

  for (const item of self._items || [])
    attr(item, 'aria-current', item === lastInList ? 'page' : null);
};

customElements.define('ds-breadcrumbs', DSBreadcrumbsElement);
