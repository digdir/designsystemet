import {
  attr,
  customElements,
  DSElement,
  debounce,
  isBrowser,
  on,
  onHotReload,
  onMutation,
  QUICK_EVENT,
  useId,
} from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
}

const ATTR_FIELD = 'data-field';
const CSS_FIELD_SIZE = '--_ds-field-sizing';
const CSS_VISIBILITY = '--_ds-visibility-detection';
const TYPE_DESCRIPTION = 'description';
const TYPE_VALIDATION = 'validation';
const SELECTOR_DESCRIPTION = `[${ATTR_FIELD}="${TYPE_DESCRIPTION}"]`;
const SELECTOR_VALIDATION = `[${ATTR_FIELD}="${TYPE_VALIDATION}"]`;
const FIELDS = new Set<DSFieldElement>();
const FILEDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];

const handleVisibility = (event: Partial<AnimationEvent>) => {
  if (
    event.target instanceof Element &&
    getComputedStyle(event.target, event.pseudoElement).getPropertyValue(
      CSS_VISIBILITY,
    )
  )
    handleMutations();
};

const handleMutations = debounce(() => {
  console.log('wire it up!');
  setupFieldsets();
  setupFields();
}, 200); // Debounce to avoid excessive calculations on multiple mutations

// Connect fieldset legend and descriptions
const setupFieldsets = () => {
  for (const fieldset of FILEDSETS) {
    const legend = fieldset.querySelector('legend');
    const description = fieldset.querySelector(
      `:scope > ${SELECTOR_DESCRIPTION}`,
    ); // TODO Allow nested description elements
    const labelledby = [legend, description].map(useId).join(' ');
    attr(fieldset, 'aria-labelledby', labelledby);
  }
};

const setupFields = () => {
  for (const field of FIELDS) {
    const descs: Element[] = [];
    const labels: HTMLLabelElement[] = [];
    let input: HTMLInputElement | undefined;

    for (const el of field.getElementsByTagName('*')) {
      if (el instanceof HTMLLabelElement) labels.push(el);
      else if (isInputLike(el)) input = el;
      else {
        const type = el.getAttribute(ATTR_FIELD); // Using getAttribute not attr for best performance
        if (type === TYPE_VALIDATION && isVisible(el)) descs.unshift(el);
        else if (type === TYPE_DESCRIPTION && isVisible(el)) descs.push(el);
      }
    }

    if (!input) return;
    for (const label of labels) attr(label, 'for', useId(input));
    if (input instanceof HTMLTextAreaElement) {
      input.style.setProperty(CSS_FIELD_SIZE, 'auto');
      input.style.setProperty(CSS_FIELD_SIZE, `${input.scrollHeight}px`); // Polyfill field-sizing for iOS
    }

    // Add fieldset validation
    const validation = field
      .closest('fieldset')
      ?.querySelector(SELECTOR_VALIDATION); // TODO Allow nested validation elements
    if (isVisible(validation)) descs.unshift(validation);

    const isBoolish = input.type === 'radio' || input.type === 'checkbox';
    attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
    attr(input, 'aria-describedby', descs.map(useId).join(' '));
    attr(input, 'aria-invalid', `${!descs.some(isInvalid)}`);
    // TODO renderCounter(input)?
  }
};

const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el && // Adds support for custom elements implemeted with attachInternals()
  !(el instanceof HTMLButtonElement); // But skip <button> elements

const isVisible = (el?: Element | null): el is Element =>
  el instanceof Element && !!el.clientHeight;

const isInvalid = (el: Element): boolean =>
  attr(el, 'data-color') !== 'success';

// Used to keep track of active fields on the page
export class DSFieldElement extends DSElement {
  connectedCallback() {
    FIELDS.add(this);
    handleMutations();
  }
  disconnectedCallback() {
    FIELDS.delete(this);
  }
}

customElements.define('ds-field', DSFieldElement);

onHotReload('field', () => [
  on(document, 'animationend', handleVisibility, QUICK_EVENT),
  onMutation(document, handleMutations, {
    debounce: false, // No need to timeout debounce here as we handle it ourselves
    attributeFilter: [ATTR_FIELD],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
