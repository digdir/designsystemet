import {
  announce,
  attr,
  attrOrCSS,
  customElements,
  DSElement,
  debounce,
  isWindows,
  on,
  onMutation,
  QUICK_EVENT,
  useId,
  warn,
} from '../utils/utils';

// TODO: Document that Validation must be hidden with "hidden" attribute (or completely removed from DOM), not display: none
declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
}

const ATTR_INVALID = 'aria-invalid';
const ATTR_DESCRIBEDBY = 'aria-describedby';
const ATTR_INDETERMINATE = 'data-indeterminate';
const COUNTER_DEBOUNCE = isWindows() ? 800 : 200; // Longer debounce on Windows due to NVDA performance
const WARNING_MULTIPLE_INPUTS = `Fields should only have one input element. Use <fieldset> to group multiple fields:`;

const handleFieldMutation = (field: DSFieldElement) => {
  const labels: HTMLLabelElement[] = [];
  const nextDescs: string[] = []; // Keep track of descriptions we are adding in this mutation
  const prevDescs = field._descs || []; // Retrieve previously managed IDs for this field
  let hasValidation = false;
  let invalid = false;

  if (field._input?.hidden) field._input = undefined; // Reset input if it has been hidden

  for (const el of field.getElementsByTagName('*')) {
    if (el instanceof HTMLLabelElement) labels.push(el);
    if ((el as HTMLElement).hidden) continue; // Skip hidden elements except labels
    if (isInputLike(el)) {
      if (field._input?.isConnected && field._input !== el)
        warn(WARNING_MULTIPLE_INPUTS, field);
      else field._input = el; // Only register if visible input
    } else {
      const type = el.getAttribute('data-field'); // Using getAttribute instead of attr for best performance
      if (type === 'counter') field._counter = el;
      if (type === 'validation') {
        nextDescs.unshift(useId(el));
        hasValidation = true;
        invalid = invalid || isInvalid(el);
      } else if (type) nextDescs.push(useId(el)); // Adds both counter and descriptions
    }
  }

  if (!field._input?.isConnected) return; // Do not warn about missing input as virtual DOM libraries might give false positives

  const input = field._input;
  for (const label of labels) attr(label, 'for', useId(input) || null);

  const fieldsetValidation = field
    .closest('fieldset')
    ?.querySelector<HTMLElement>(':scope > [data-field="validation"]');

  // Connect fieldset validation to inputs
  if (fieldsetValidation && !fieldsetValidation?.hidden) {
    hasValidation = true;
    invalid = invalid || isInvalid(fieldsetValidation);
    nextDescs.unshift(useId(fieldsetValidation));
  }

  // Add support for data-indeterminate attribute as this normally can only be set by javascript

  const indeterminate = attr(input, ATTR_INDETERMINATE);
  if (indeterminate) input.indeterminate = indeterminate === 'true';

  // Expand click area to ds-field if radio/checkbox
  const isBoolish = input.type === 'radio' || input.type === 'checkbox';
  if (isBoolish) attr(field, 'data-clickdelegatefor', useId(input));

  // Setup aria-describedby, but repsect existing ids in aria-describedby
  const describedby = attr(input, ATTR_DESCRIBEDBY)?.trim().split(/\s+/);
  const keep = describedby?.filter((id) => !prevDescs.includes(id)) || []; // Find non-ds-field-managed aria-describedby IDs
  attr(input, ATTR_DESCRIBEDBY, [...nextDescs, ...keep].join(' ') || null);
  field._descs = nextDescs;

  // Only manage aria-invalid when field has validation elements, and aria-invalid does not already exist
  const hadValidation = field._validation;
  if (hasValidation && !hadValidation && !input.hasAttribute(ATTR_INVALID)) {
    attr(input, ATTR_INVALID, 'true');
    field._validation = true;
  } else if (!hasValidation && hadValidation) {
    attr(input, ATTR_INVALID, null); // Remove aria-invalid
    field._validation = undefined;
  }

  field.handleEvent(); // Update counter and textarea sizing
};

// Used as fallback in tests when CSS is not loaded
const TEXTS = {
  over: '%d tegn for mye',
  under: '%d tegn igjen',
};

const debouncedCounterLiveRegion = debounce((input: Element, text: string) => {
  if (document.activeElement === input) announce(text); // Only announce if input is still focused
}, COUNTER_DEBOUNCE);

const isInvalid = (el: Element) => el.getAttribute('data-color') !== 'success';
const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el && // Adds support for custom elements implemeted with attachInternals()
  !(el instanceof HTMLButtonElement) && // But skip <button> elements
  (el as HTMLInputElement).type !== 'hidden'; // And skip input type="hidden"

// Custom element is used to performantly keep track of fields on the page
export class DSFieldElement extends DSElement {
  _counter?: Element; // Using underscore instead of private fields for backwards compatibility
  _descs?: string[];
  _input?: HTMLInputElement;
  _validation?: boolean;
  _unevents?: () => void;
  _unmutate?: () => void;

  connectedCallback() {
    this._unevents = on(this, 'input', this, QUICK_EVENT);
    this._unmutate = onMutation(this, () => handleFieldMutation(this), {
      attributeFilter: [
        'data-field',
        'data-limit',
        'hidden', // Needed to check validation visibility
        'id', // Needed to sync label "for" when ID of input/selec/textarea changes
        'value', // Needed to detect changes in controlled React inputs as they do not trigger input events
        ATTR_INDETERMINATE,
      ],
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
  handleEvent(event?: Event) {
    const { _counter, _input } = this;

    if (_counter?.isConnected && _input) {
      const limit = Number(attr(_counter, 'data-limit')) || 0;
      const count = limit - _input.value.length;
      const state = count < 0 ? 'over' : 'under';
      const label = (attrOrCSS(_counter, `data-${state}`) || TEXTS[state]) // Browser translation tools will not pick up dyanmic text anyway, so no need to use aria-labelledby here
        ?.replace('%d', `${Math.abs(count)}`);

      if (!label) warn(`Missing data-${state} on:`, this);
      attr(_counter, 'data-label', label); // Using attribute to prevent hydation errors, not using aria-label to make axe tests happy
      attr(_counter, 'data-state', state);
      attr(_counter, 'data-color', count < 0 ? 'danger' : null);

      // Only update live region when user is actually typing
      if (event?.type === 'input' && label)
        debouncedCounterLiveRegion(_input, label); // Debounce live region to avoid NVDA interupting announcing typed text
    }
    if (_input instanceof HTMLTextAreaElement) {
      _input.style.setProperty('--_ds-field-sizing', 'auto');
      _input.style.setProperty(
        '--_ds-field-sizing',
        `${_input.scrollHeight}px`,
      );
    }
  }
  disconnectedCallback() {
    this._unevents?.();
    this._unmutate?.();
    this._unevents = this._unmutate = undefined;
    this._input = this._counter = this._descs = this._validation = undefined;
  }
}

customElements.define('ds-field', DSFieldElement);
