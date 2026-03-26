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
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ATTR_LABEL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    const resize = debounce(() => render(this), 100);
    this._label = attrOrCSS(this, ATTR_LABEL); // Label can have been set by attributeChangedCallback before connectedCallback
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._unresize = on(window, 'resize', resize);
    this._unmutate = onMutation(this, () => render(this), {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback(_name: string, _prev?: string, next?: string) {
    if (!this._unmutate || !next) return; // Ensure we do not run unless connected and we have a label to set
    this._label = next; // Update cacheed label if aria-label attribute changes
    render(this);
  }
  disconnectedCallback() {
    this._unresize?.();
    this._unmutate?.();
    this._unresize = this._unmutate = this._items = undefined;
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
