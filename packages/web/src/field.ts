import {
  attr,
  customElements,
  DSElement,
  debounce,
  isBrowser,
  onHotReload,
  onMutation,
  useId,
} from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
}

const ATTR_FIELD = 'data-field';
const CSS_FIELD_SIZE = '--_ds-field-sizing';
const TYPE_DESCRIPTION = 'description';
const TYPE_VALIDATION = 'validation';
const SELECTOR_FIELDSET_DESCRIPTION = `:scope > [${ATTR_FIELD}="${TYPE_DESCRIPTION}"]`;
const SELECTOR_FIELDSET_VALIDATION = `:scope > [${ATTR_FIELD}="${TYPE_VALIDATION}"]`;
const FIELDS = new Set<DSFieldElement>();
const FILEDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];

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
    ].filter(isVisible);

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
            field,
            `should only have one input element.Use <fieldset> to group multiple <${field.nodeName.toLowerCase()}> elements`,
          );
        input = el;
      } else if (isVisible(el)) {
        const type = el.getAttribute(ATTR_FIELD); // Using getAttribute not attr for best performance
        if (type === TYPE_VALIDATION) descs.unshift(el);
        else if (type === TYPE_DESCRIPTION) descs.push(el);
      }
    }

    if (!input) return console.error(field, 'is missing input element');
    for (const label of labels) attr(label, 'for', useId(input));
    if (input instanceof HTMLTextAreaElement) {
      input.style.setProperty(CSS_FIELD_SIZE, 'auto');
      input.style.setProperty(CSS_FIELD_SIZE, `${input.scrollHeight}px`); // Polyfill field-sizing for iOS
    }

    const fieldsetValidation = field
      .closest('fieldset')
      ?.querySelector(SELECTOR_FIELDSET_VALIDATION);
    if (isVisible(fieldsetValidation)) descs.unshift(fieldsetValidation);

    const isBoolish = input.type === 'radio' || input.type === 'checkbox';
    attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
    attr(input, 'aria-describedby', descs.map(useId).join(' '));
    attr(input, 'aria-invalid', `${descs.some(isInvalid)}`);
  }
};

const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el && // Adds support for custom elements implemeted with attachInternals()
  !(el instanceof HTMLButtonElement); // But skip <button> elements

const isVisible = (el?: Element | null): el is Element =>
  !!el && !el.hasAttribute('hidden');

const isInvalid = (el: Element): boolean =>
  el.getAttribute(ATTR_FIELD) === TYPE_VALIDATION &&
  attr(el, 'data-color') !== 'success';

// Custom element is used to performantly keep track of fields on the page
export class DSFieldElement extends DSElement {
  connectedCallback() {
    FIELDS.add(this);
    handleMutations();
    // TODO renderCounter(input)?
  }
  disconnectedCallback() {
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
