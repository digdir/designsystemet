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
} from '../utils/utils';

// TODO: Document that Validation must be hidden with "hidden" attribute (or completely removed from DOM), not display: none
declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
}

const FIELDS = new Map<DSFieldElement, Element | null>(); // Map of Field => Counter | null
const FILEDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];
const HAS_FIELD_SIZING = isBrowser() && CSS.supports('field-sizing', 'content');
const COUNTER_DEBOUNCE = isWindows() ? 800 : 200; // Longer debounce on Windows due to NVDA performance
const NB_COUNTER = {
  over: '%d tegn for mye',
  under: '%d tegn igjen',
};

const handleMutations = debounce(() => {
  for (const el of FILEDSETS) {
    const labelledby = `${useId(el.querySelector('legend'))} ${useId(el.querySelector(':scope > :is([data-field="description"],legend + p)'))}`;
    attr(el, 'aria-labelledby', labelledby.trim());
  }
  for (const [field] of FIELDS) {
    const descs: Element[] = [];
    const labels: HTMLLabelElement[] = [];
    let input: HTMLInputElement | undefined;
    let counter: Element | undefined;
    let invalid = false;

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
        const type = el.getAttribute('data-field'); // Using getAttribute not attr for best performance
        if (type === 'counter') counter = el;
        if (type === 'validation') {
          descs.unshift(el);
          invalid = invalid || isInvalid(el);
        } else if (type) descs.push(el); // Adds both counter and descriptions
      }
    }

    FIELDS.set(field, counter || null); // Update counter reference
    if (!input)
      console.warn(`Designsystemet: Field is missing input element:`, field);
    else {
      for (const label of labels) attr(label, 'for', useId(input));

      const isBoolish = input.type === 'radio' || input.type === 'checkbox';
      const fieldsetValidation = field
        .closest('fieldset')
        ?.querySelector(':scope > [data-field="validation"]');
      if (isNotHidden(fieldsetValidation)) {
        invalid = invalid || isInvalid(fieldsetValidation);
        descs.unshift(fieldsetValidation);
      }

      field.handleEvent(input); // Update counter and textarea sizing
      attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
      attr(input, 'aria-describedby', descs.map(useId).join(' '));
      attr(input, 'aria-invalid', `${invalid}`);
    }
  }
}, 100); // Debounce to avoid excessive calculations on multiple mutations

const debouncedCounterLiveRegion = debounce(
  (text: string, live?: Element | null) => {
    if (live) live.textContent = text;
  },
  COUNTER_DEBOUNCE,
);

const isInvalid = (el: Element) => attr(el, 'data-color') !== 'success';

const isNotHidden = (el?: Element | null): el is Element =>
  !!el && !(el as HTMLElement).hidden;

const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el && // Adds support for custom elements implemeted with attachInternals()
  !(el instanceof HTMLButtonElement); // But skip <button> elements

// Custom element is used to performantly keep track of fields on the page
export class DSFieldElement extends DSElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(
      tag('slot'),
      tag('div', {
        'aria-live': 'polite', // Used to announce counter updates
        style: `position:fixed;white-space:nowrap;clip:rect(0 0 0 0)`, // "sr-only"
      }),
    );
  }
  connectedCallback() {
    FIELDS.set(this, null); // Register field, but let mutation observer find counter
    on(this, 'input', this, QUICK_EVENT);
    handleMutations(); // Initial setup
  }
  handleEvent(eventOrTarget: Event | Element) {
    const el = (eventOrTarget as Event).target || eventOrTarget;
    const counter = isInputLike(el) && FIELDS.get(this);

    if (counter) {
      const live = this.shadowRoot?.lastElementChild;
      const limit = Number(attr(counter, 'data-limit')) || 0;
      const count = limit - el.value.length;
      const state = count < 0 ? 'over' : 'under';
      const label = (
        attr(counter, `data-${state}`) || NB_COUNTER[state]
      ).replace('%d', `${Math.abs(count)}`);

      attr(counter, 'aria-label', label);
      attr(counter, 'data-state', state);
      attr(counter, 'data-color', count < 0 ? 'danger' : null);
      debouncedCounterLiveRegion(label, live); // Debounce live region to avoid NVDA interupting announcing typed text
    }
    if (!HAS_FIELD_SIZING && el instanceof HTMLTextAreaElement) {
      el.style.setProperty('--_ds-field-sizing', 'auto');
      el.style.setProperty('--_ds-field-sizing', `${el.scrollHeight}px`);
    }
  }
  disconnectedCallback() {
    off(this, 'input', this, QUICK_EVENT);
    FIELDS.delete(this);
  }
}

customElements.define('ds-field', DSFieldElement);

onHotReload('field', () => [
  onMutation(document, handleMutations, {
    attributeFilter: ['hidden', 'data-field'], // Listen for hidden to detect hidden validations
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
