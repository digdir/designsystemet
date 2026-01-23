import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import {
  attr,
  customElements,
  debounce,
  off,
  on,
  onMutation,
  QUICK_EVENT,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {
  _unmutate?: () => void; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    super.connectedCallback();
    const render = debounce(() => polyfillPlaceholderShown(this), 100);
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
    on(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unmutate?.();
    this._unmutate = undefined;
    off(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
}

// A non-empty placeholder attribute is required to activate the :placeholder-shown pseudo selector used in our chevron styling
const polyfillPlaceholderShown = ({ control }: DSSuggestionElement) =>
  !control || control.placeholder || attr(control, 'placeholder', ' '); // .control comes from UHTMLComboboxElement

// Since showPopover({ source }) is not supported in all browsers yet:
const polyfillToggleSource = (event: Partial<ToggleEvent>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const detail = event.newState === 'open' && self.control; // .control comes from UHTMLComboboxElement

  if (detail)
    self.list?.dispatchEvent(new CustomEvent('ds-toggle-source', { detail }));
};

customElements.define('ds-suggestion', DSSuggestionElement);
