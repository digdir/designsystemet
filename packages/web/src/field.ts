import {
  attr,
  customElements,
  DSElement,
  debounce,
  isBrowser,
  isWindows,
  off,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
  tag,
  useId,
} from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
}

const CSS_FIELD_SIZE = '--_ds-field-sizing';
const ATTR_COUNTER_TEXT = 'data-counter-text';
const ATTR_COUNTER_ARIA = 'data-counter-aria';
const ATTR_FIELD = 'data-field';
const TYPE_DESCRIPTION = 'description';
const TYPE_VALIDATION = 'validation';
const COUNTER_DEBOUNCE = isWindows() ? 800 : 200; // Longer debounce on Windows due to NVDA performance
const COUNTER_TEXT = {
  over: '%d tegn for mye',
  under: '%d tegn igjen',
  hint: 'Maks %d tegn tillatt.',
};

const SELECTOR_FIELDSET_DESCRIPTION = `:scope > [${ATTR_FIELD}="${TYPE_DESCRIPTION}"],:scope > legend + p`; // legend + p is kept for backwards compatibility
const SELECTOR_FIELDSET_VALIDATION = `:scope > [${ATTR_FIELD}="${TYPE_VALIDATION}"]`;
const SELECTOR_FIELD_COUNTER = '[data-field="counter"]';

const FIELDS = new Set<DSFieldElement>();
const FILEDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];
const STYLE_SR_ONLY = `position:absolute;clip:rect(0 0 0 0);overflow:hidden;width:1px;height:1px;white-space:nowrap;pointer-events:none`;

// TODO: Document that Validation must be hidden with "hidden" attribute (or completely removed from DOM), not display: none
const handleMutations = debounce(() => {
  setupFieldsets();
  setupFields();
}, 100); // Debounce to avoid excessive calculations on multiple mutations

// Connect fieldset legend and descriptions
const setupFieldsets = () => {
  for (const fieldset of FILEDSETS) {
    const labelledby = [
      fieldset.querySelector('legend'),
      fieldset.querySelector(SELECTOR_FIELDSET_DESCRIPTION),
    ].filter(isNotHidden);

    attr(fieldset, 'aria-labelledby', labelledby.map(useId).join(' '));
  }
};

const setupFields = () => {
  for (const field of FIELDS) {
    const descs: Element[] = [];
    const labels: HTMLLabelElement[] = [];
    let input: HTMLInputElement | undefined;

    for (const el of field.getElementsByTagName('*')) {
      if (el instanceof HTMLLabelElement) labels.push(el);
      else if (isInputLike(el)) {
        if (input)
          console.warn(
            `Designsystemet: Fields should only have one input element. Use <fieldset> to group multiple fields:`,
            field,
          );
        input = el;
      } else if (isNotHidden(el)) {
        const type = el.getAttribute(ATTR_FIELD); // Using getAttribute not attr for best performance
        if (type === TYPE_VALIDATION) descs.unshift(el);
        else if (type) descs.push(el);
      }
    }

    if (!input)
      console.warn(`Designsystemet: Field is missing input element:`, field);
    else {
      for (const label of labels) attr(label, 'for', useId(input));

      const isBoolish = input.type === 'radio' || input.type === 'checkbox';
      const fieldsetValidation = field
        .closest('fieldset')
        ?.querySelector(SELECTOR_FIELDSET_VALIDATION);
      if (isNotHidden(fieldsetValidation)) descs.unshift(fieldsetValidation);

      field.handleEvent({ target: input }); // Run counter and textrarea resize
      attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
      attr(input, 'aria-describedby', descs.map(useId).join(' '));
      attr(input, 'aria-invalid', `${descs.some(isInvalid)}`);
    }
  }
};

const getCounterText = (
  el: Element,
  key: keyof typeof COUNTER_TEXT,
  num: number,
) =>
  (attr(el, `data-${key}`) || COUNTER_TEXT[key]).replace(
    '%d',
    `${Math.abs(num)}`,
  );

const setupCounter = (field: DSFieldElement, target: EventTarget | null) => {
  const el =
    isInputLike(target) &&
    field.querySelector<HTMLElement>(SELECTOR_FIELD_COUNTER);

  if (el) {
    const live = field.shadowRoot?.lastElementChild as HTMLElement;
    const limit = Number(attr(el, 'data-limit')) || 0;
    const count = limit - target.value.length;
    const text = getCounterText(el, count < 0 ? 'over' : 'under', count);

    attr(el, ATTR_COUNTER_TEXT, text);
    attr(el, ATTR_COUNTER_ARIA, getCounterText(el, 'hint', limit));
    attr(el, 'data-color', count < 0 ? 'danger' : null);
    setupCounterLiveRegion(live, text); // Debounce live region to avoid NVDA interupting announcing typed text
  }
};

const setupCounterLiveRegion = debounce((live: Element, text: string) => {
  live.textContent = text;
}, COUNTER_DEBOUNCE);

// iOS does not support field-sizing: content, so we need to manually resize
const setupTextareaFieldSizingiOS = (target: EventTarget | null) => {
  if (target instanceof HTMLTextAreaElement) {
    target.style.setProperty(CSS_FIELD_SIZE, 'auto');
    target.style.setProperty(CSS_FIELD_SIZE, `${target.scrollHeight}px`);
  }
};

const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el && // Adds support for custom elements implemeted with attachInternals()
  !(el instanceof HTMLButtonElement); // But skip <button> elements

const isNotHidden = (el?: Element | null): el is Element =>
  !!el && !(el as HTMLElement).hidden;

const isInvalid = (el: Element): boolean =>
  el.getAttribute(ATTR_FIELD) === TYPE_VALIDATION &&
  attr(el, 'data-color') !== 'success';

// Custom element is used to performantly keep track of fields on the page
export class DSFieldElement extends DSElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(
      tag('slot'),
      tag('div', { 'aria-live': 'polite', style: STYLE_SR_ONLY }), // Used to announce counter updates
    );
  }
  connectedCallback() {
    FIELDS.add(this);
    on(this, 'input', this, QUICK_EVENT);
    handleMutations(); // Initial setup
  }
  handleEvent({ target }: { target: EventTarget | null }) {
    setupCounter(this, target);
    setupTextareaFieldSizingiOS(target);
  }
  disconnectedCallback() {
    off(this, 'input', this, QUICK_EVENT);
    FIELDS.delete(this);
  }
}

customElements.define('ds-field', DSFieldElement);

onHotReload('field', () => [
  onMutation(document, handleMutations, {
    debounce: false, // No need to timeout debounce here as we handle it ourselves
    attributeFilter: ['hidden', ATTR_FIELD], // Listen for hidden to detect hidden validations
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
