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
const MUTATIONS: MutationObserverInit = {
  attributeFilter: ['disabled', 'hidden', 'label'], // React <Suggestion> filters by setting disabled on options
  characterData: true,
  childList: true,
  subtree: true,
};
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

    this._unmutate = onMutation(this, render, MUTATIONS); // .control and .list are direct children, and option changes affect the empty option
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

const handleEmpty = (event: Pick<Event, 'currentTarget'>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const { creatable, control, list, options } = self;
  if (!options) return;

  const value = control?.value.trim() || '';
  const query = value.toLowerCase();
  const filter = !list?.hasAttribute('data-nofilter');
  let emptyOpt: HTMLOptionElement | undefined;
  let hide = creatable && !value; // Hide initial empty state for an empty creatable input

  for (const opt of options) {
    if (!emptyOpt && opt.hasAttribute(ATTR_EMPTY)) emptyOpt = opt;
    else if (!hide) {
      const label = opt.label?.toLowerCase() || '';
      hide = creatable
        ? label === query // Hide "Legg til" when the query already exists
        : !opt.disabled && !opt.hidden && (!filter || label.includes(query)); // Hide when <u-datalist> shows another option, so it is not counted in the screen reader hit count
    }
    if (hide && emptyOpt) break; // Speed up if both conditions are met
  }
  if (!emptyOpt) return;

  attr(emptyOpt, 'hidden', hide ? '' : null); // Using attr() as setting an unchanged attribute would trigger the MutationObserver again
  attr(emptyOpt, 'label', value); // Ensures option is not filtered out by <u-combobox>
  attr(emptyOpt, 'value', creatable ? value : ''); // Ensures clicking option does nothing

  if (creatable) {
    const hasValue = self.values.includes(value);
    const text = attrOrCSS(emptyOpt, ATTR_EMPTY);
    const hint =
      (!hasValue && text?.replace(REGEX_CREATE, () => value)) || value; // Only show "Legg til" if not already created

    if (!text) warn(`Missing ${ATTR_EMPTY} value on:`, emptyOpt);
    else attr(emptyOpt, ATTR_EMPTY, text); // Speed up by caching attribute value

    const disabled = hasValue && emptyOpt.textContent ? 'true' : null;
    attr(emptyOpt, 'disabled', disabled); // Hide hint if already created
    attr(emptyOpt, ATTR_CREATE, hint);
  }
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
