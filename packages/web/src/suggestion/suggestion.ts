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

// Load and export u-datalist since this is a pure polyfill and not custom Designsystemet elements, should run before suggestion
export * from '@u-elements/u-datalist';

const ATTR_EMPTY = 'data-empty';
const ATTR_CREATE = 'data-create';
const EVENTS_EMPTY = 'comboboxafterselect comboboxprogrammaticinput input';
const REGEX_CREATE = /\{value\}|%s/; // Support both new %s and old {value} syntax
const SINGULAR = 'data-sr-plural';
const PLURAL = 'data-sr-plural';
const TEXTS =
  'added,clear,empty,found,invalid,items,of,plural,remove,removed,singular,toggle'
    .split(',')
    .map((key) => `data-sr-${key}`);

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {
  _unmutate?: ReturnType<typeof onMutation>; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    for (const key of TEXTS) attr(this, key, attrOrCSS(this, key)); // Convert CSS variables to data-sr-attributes
    super.connectedCallback(); // Run after setting data-sr-attributes

    this._unmutate = onMutation(this, render, { childList: true }); // .control and .list are direct children of the custom element
    on(this, EVENTS_EMPTY, handleEmpty, QUICK_EVENT);
    on(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unmutate?.();
    this._unmutate = undefined;
    off(this, EVENTS_EMPTY, handleEmpty, QUICK_EVENT);
    off(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
}

const render = (self: DSSuggestionElement) => {
  let { control, list } = self;
  if (!list) list = self.querySelector('u-datalist'); // Fallback to u-datalist since React can render the ds-suggestion before u-datalist is connected

  if (control) attr(control, 'popovertarget', list ? useId(list) : null);
  if (list) {
    if (!attr(list, PLURAL)) attr(list, PLURAL, attr(self, PLURAL)); // Inherit translations from u-combobox to u-datalist
    if (!attr(list, SINGULAR)) attr(list, SINGULAR, attr(self, SINGULAR)); // Inherit translations from u-combobox to u-datalist
    attr(list, 'data-is-floating', 'true'); // identifier for css to toggle opacity when it is placed by floating-ui.
    attr(list, 'popover', 'manual'); // Ensure popover attribute is set on the list
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
  attr(empty, 'label', value); // Ensures option is not filtered out by <u-combobox>
  attr(empty, 'value', creatable ? value : ''); // Ensures clicking option does nothing

  if (!creatable || empty.textContent) return;
  const text = attrOrCSS(empty, ATTR_EMPTY);
  if (!text) warn(`Missing ${ATTR_EMPTY} value on:`, empty);
  else attr(empty, ATTR_EMPTY, text); // Speed up by caching attribute value
  attr(empty, ATTR_CREATE, text?.split(REGEX_CREATE).join(value)); // Using split+join to avoid $' and $& replacements
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
