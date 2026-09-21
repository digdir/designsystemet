import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
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

export class DSBreadcrumbsElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _label = { key: ARIA_LABEL, value: null as string | null };
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ARIA_LABEL, ARIA_LABELLEDBY]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    const resize = debounce(() => render(this), 100);
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._unresize = on(window, 'resize', resize);
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback() {
    if (this._unmutate) render(this); // Ensure we do not run unless connected, and keep cached label if aria-label/aria-labelledby is removed
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

  attr(self, 'role', isListHidden ? null : 'navigation'); // Remove role if no visible breadcrumb list items
  for (const item of self._items || [])
    attr(item, 'aria-current', item === lastItemInList ? 'page' : null);

  // Get current label attributes
  const label = attrOrCSS(self, ARIA_LABEL)?.trim();
  const labelledby = attr(self, ARIA_LABELLEDBY)?.trim();
  const prevLabel = label || labelledby; // Prefer aria-label over aria-labelledby as this is also most browsers default if both are defined

  // Update, but keep cached label if aria-label/aria-labelledby is removed
  if (prevLabel) self._label.value = prevLabel;
  if (prevLabel) self._label.key = labelledby ? ARIA_LABELLEDBY : ARIA_LABEL;
  const nextLabel = isListHidden ? null : self._label.value;

  // Update label attributes, but only if needed to prevent infinite attributeChangedCallback loop
  if (prevLabel !== nextLabel) {
    attr(self, ARIA_LABELLEDBY, null); // Reset aria-attributes before setting new
    attr(self, ARIA_LABEL, null);
    attr(self, self._label.key, nextLabel); // Setup new attribute
  }
};

customElements.define('ds-breadcrumbs', DSBreadcrumbsElement);
