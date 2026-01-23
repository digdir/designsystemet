import {
  attr,
  customElements,
  DSElement,
  debounce,
  isNorwegian,
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
const NB_LABEL = 'Du er her';

export class DSBreadcrumbsElement extends DSElement {
  _items?: HTMLCollectionOf<HTMLAnchorElement>; // Using underscore instead of private fields for backwards compatibility
  _unresize?: () => void;
  _unmutate?: () => void;

  static get observedAttributes() {
    return [ATTR_LABEL]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    // aria-label can allready have been hidden by attributeChangedCallback
    if (!attr(this, ATTR_LABEL_HIDDEN) && !attr(this, ATTR_LABEL)) {
      if (isNorwegian(this)) attr(this, ATTR_LABEL, NB_LABEL);
      else console.warn('Designsystemet: Missing aria-label on:', this);
    }
    const render = debounce(this.attributeChangedCallback.bind(this), 100);
    this._items = this.getElementsByTagName('a'); // Speed up by caching HTMLCollection
    this._unresize = on(window, 'resize', render);
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback() {
    const last = this._items?.[this._items.length - 1];
    const lastInList = last?.parentElement === this ? null : last;
    const isListHidden = !lastInList?.offsetHeight;
    const labelHidden = attr(this, ATTR_LABEL_HIDDEN);
    const label = attr(this, ATTR_LABEL);

    // Only update labels if needed to prevent infinite attribute update loop
    attr(this, 'role', isListHidden ? null : 'navigation');
    if (isListHidden && !labelHidden && label) {
      attr(this, ATTR_LABEL_HIDDEN, label);
      attr(this, ATTR_LABEL, null);
    } else if (!isListHidden && labelHidden && !label) {
      attr(this, ATTR_LABEL, labelHidden);
      attr(this, ATTR_LABEL_HIDDEN, null);
    }

    for (const item of this._items || [])
      attr(item, 'aria-current', item === lastInList ? 'page' : null);
  }
  disconnectedCallback() {
    this._unresize?.();
    this._unmutate?.();
    this._unresize = this._unmutate = this._items = undefined;
  }
}

customElements.define('ds-breadcrumbs', DSBreadcrumbsElement);
