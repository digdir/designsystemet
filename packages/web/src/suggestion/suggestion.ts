import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import {
  attr,
  customElements,
  off,
  on,
  onMutation,
  QUICK_EVENT,
} from '../utils/utils';

export * from '@u-elements/u-datalist'; // Load and export u-datalist since this is a pure polyfill and not custom Designsystemet elements, should run before suggestion
export * from './suggestion-helper';

const ATTR_EMPTY = 'data-empty';
const EVENTS_EMPTY = 'comboboxafterselect input';
const FALSE = 'false';
const MUTATIONS: MutationObserverInit = {
  attributeFilter: ['aria-hidden', 'disabled', 'hidden', 'label'],
  characterData: true,
  childList: true,
  subtree: true,
};

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {
  _unmutate?: ReturnType<typeof onMutation>; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    super.connectedCallback();
    this._unmutate = onMutation(this, onMutations, MUTATIONS); // .control and .list are direct children, and option changes affect the empty option
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

const onMutations = (self: DSSuggestionElement) => {
  const { list } = self;
  if (list) attr(list, 'popover', 'manual'); // Ensure popover attribute is set on the list
  handleEmpty({ currentTarget: self });
};

const isHidden = (opt: HTMLOptionElement) =>
  opt.disabled || opt.hidden || opt.getAttribute('aria-hidden') === 'true';

const handleEmpty = (event: Partial<Event>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const { creatable, control, options } = self;
  if (!options) return;

  const value = control?.value.trim() || '';
  const query = value.toLowerCase();
  let emptyOpt: HTMLOptionElement | undefined;
  let hide = creatable && !value; // Hide initial empty state for an empty creatable input

  for (const opt of options) {
    if ((opt.getAttribute(ATTR_EMPTY) ?? FALSE) !== FALSE) emptyOpt = opt;
    else if (!hide && !isHidden(opt)) {
      // Hide when <u-datalist> shows another option, so it is not counted in the screen reader hit count
      hide = !creatable || opt.label?.toLowerCase() === query; // Hide "Legg til" when a selectable option already has the query as label
    }
    if (hide && emptyOpt) break; // Speed up if both conditions are met
  }
  if (!emptyOpt) return;
  // Note: isHidden() can read stale aria-hidden as this runs before <u-datalist> filters, but MUTATIONS observes aria-hidden, so this runs again after filtering
  attr(emptyOpt, 'hidden', hide ? '' : null); // Using attr() as setting an unchanged attribute would trigger the MutationObserver again
  attr(emptyOpt, 'label', value); // Ensures option is not filtered out, and CSS can read text
  attr(emptyOpt, 'value', creatable ? value : ''); // Ensures clicking option does nothing
};

// Since showPopover({ source }) is not supported in all browsers yet:
const polyfillToggleSource = (event: Partial<ToggleEvent>) => {
  const self = event.currentTarget as DSSuggestionElement;
  const detail = event.newState === 'open' && self.control; // .control comes from UHTMLComboboxElement
  const data = { bubbles: true, composed: true, detail };

  if (detail)
    self.list?.dispatchEvent(new CustomEvent('ds-toggle-source', data));
};

// Ensure u-datalist is defined before ds-suggestion
customElements.define('ds-suggestion', DSSuggestionElement);
