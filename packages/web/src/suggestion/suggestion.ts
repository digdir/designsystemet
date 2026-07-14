import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import {
  attr,
  customElements,
  off,
  on,
  onMutation,
  QUICK_EVENT,
  useId,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {
  _unmutate?: ReturnType<typeof onMutation>; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    super.connectedCallback();
    this._unmutate = onMutation(this, render, { childList: true }); // .control and .list are direct children of the custom element
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
const render = (self: DSSuggestionElement) => {
  const { control, list } = self;
  const datalist = list || self.querySelector('u-datalist'); // Fallback to u-datalist since React can render the ds-suggestion before u-datalist is connected

  if (control && !control.placeholder) attr(control, 'placeholder', ' '); // .control comes from UHTMLComboboxElement
  if (control) attr(control, 'popovertarget', useId(list) || null);
  if (datalist) attr(datalist, 'popover', 'manual'); // Ensure popover attribute is set on the list
  if (datalist) attr(datalist, 'data-is-floating', 'true'); // identifier for css to toggle opacity when it is placed by floating-ui.
};

// Since showPopover({ source }) is not supported in all browsers yet:
const polyfillToggleSource = (event: Partial<ToggleEvent>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const detail = event.newState === 'open' && self.control; // .control comes from UHTMLComboboxElement

  if (detail)
    self.list?.dispatchEvent(
      new CustomEvent('ds-toggle-source', {
        bubbles: true,
        composed: true, // Enable bubbling out of shadow DOM boundries
        detail, // Since showPopover({ source }) is not supported in all browsers yet
      }),
    );
};

// Ensure u-datalist is defined before ds-suggestion
customElements.define('ds-suggestion', DSSuggestionElement);
