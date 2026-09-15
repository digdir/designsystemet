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
const SINGULAR = 'data-sr-singular';
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
  const { creatable, control, options, items } = self as DSSuggestionElement;
  if (!options) return;

  const value = control?.value.trim() || '';
  const query = value.toLowerCase();
  let emptyOptElement: HTMLOptionElement | undefined;
  let hasMatch = false;

  for (const opt of options) {
    if (!emptyOptElement && opt.hasAttribute(ATTR_EMPTY)) emptyOptElement = opt;
    else if (!hasMatch && (!query || opt.label?.toLowerCase() === query))
      hasMatch = true;
    if (hasMatch && emptyOptElement) break; // Speed up if both conditions are met
  }
  if (!emptyOptElement) return;

  emptyOptElement.hidden = hasMatch; // Hide initial empty state when options exist, or when the query already exists
  attr(emptyOptElement, 'label', value); // Ensures option is not filtered out by <u-combobox>
  attr(emptyOptElement, 'value', creatable ? value : ''); // Ensures clicking option does nothing

  if (!creatable || emptyOptElement.textContent) return; // Only need to adjust text on empty element if creatable mode and no text is set
  const text = attrOrCSS(emptyOptElement, ATTR_EMPTY);
  if (!text) warn(`Missing ${ATTR_EMPTY} value on:`, emptyOptElement);
  else attr(emptyOptElement, ATTR_EMPTY, text); // Speed up by caching attribute value

  const isCreated = items[0]?.value === emptyOptElement.value;
  const createText = isCreated ? value : text?.split(REGEX_CREATE).join(value); // Only show "Legg til" if not already created
  attr(emptyOptElement, ATTR_CREATE, createText); // Using split+join to avoid $' and $& replacements
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
