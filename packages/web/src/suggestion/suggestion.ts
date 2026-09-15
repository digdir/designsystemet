import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import {
  attr,
  attrOrCSS,
  customElements,
  off,
  on,
  onMutation,
  QUICK_EVENT,
  useId,
  warn,
} from '../utils/utils';

const ATTR_EMPTY = 'data-empty';
const ATTR_CREATE = 'data-create';

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
    on(this, 'comboboxafterselect input', handleEmpty, QUICK_EVENT);
    on(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unmutate?.();
    this._unmutate = undefined;
    off(this, 'comboboxafterselect input', handleEmpty, QUICK_EVENT);
    off(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
}

const render = (self: DSSuggestionElement) => {
  const { control, list } = self;
  const datalist = list || self.querySelector('u-datalist'); // Fallback to u-datalist since React can render the ds-suggestion before u-datalist is connected

  if (control) attr(control, 'popovertarget', list ? useId(list) : null);
  if (datalist) {
    attr(datalist, 'popover', 'manual'); // Ensure popover attribute is set on the list
    attr(datalist, 'data-is-floating', 'true'); // identifier for css to toggle opacity when it is placed by floating-ui.
  }
  handleEmpty({ currentTarget: self });
};

const handleEmpty = ({ currentTarget: self }: Pick<Event, 'currentTarget'>) => {
  const { creatable, control, options } = self as DSSuggestionElement;
  if (!options) return;

  const value = control?.value.trim() || '';
  const query = value.toLowerCase();
  let empty: HTMLOptionElement | undefined;
  let exists = !value;

  for (const opt of options) {
    if (!empty && opt.hasAttribute(ATTR_EMPTY)) empty = opt;
    else if (!exists && opt.label?.toLowerCase() === query) exists = true; // Prevent creating an option that already exists
    if (exists && empty) break; // Speed up if both conditions are met
  }
  if (!empty) return;

  empty.hidden = exists;
  empty.label = value; // Ensures option is not filtered out by <u-combobox>
  empty.value = creatable ? value : ''; // Ensures clicking option does nothing

  if (!creatable || empty.textContent) return;
  const text = attrOrCSS(empty, ATTR_EMPTY);
  if (!text) warn(`Missing ${ATTR_EMPTY} value on:`, empty);
  else attr(empty, ATTR_EMPTY, text); // Speed up by caching attribute value
  attr(empty, ATTR_CREATE, text?.replace('{value}', value));
};

// Since showPopover({ source }) is not supported in all browsers yet:
const polyfillToggleSource = (event: Partial<ToggleEvent>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const detail = event.newState === 'open' && self.control; // .control comes from UHTMLComboboxElement

  if (detail)
    self.list?.dispatchEvent(
      new CustomEvent('ds-toggle-source', {
        bubbles: true,
        composed: true, // Enable bubbling out of shadow DOM boundaries
        detail, // Since showPopover({ source }) is not supported in all browsers yet
      }),
    );
};

// Ensure u-datalist is defined before ds-suggestion
customElements.define('ds-suggestion', DSSuggestionElement);
