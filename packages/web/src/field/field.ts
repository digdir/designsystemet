import {
  announce,
  attr,
  attrOrCSS,
  customElements,
  DSElement,
  debounce,
  isBrowser,
  isWindows,
  on,
  onHotReload,
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

const ATTR_INDETERMINATE = 'data-indeterminate';
const FIELDS = new Set<DSFieldElement>(); // Set of Field
const COUNTS = new WeakMap<HTMLInputElement, Element>(); // Using WeakMap so removed inputs/counts does not cause memory leaks
const FIELDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];
const COUNTER_DEBOUNCE = isWindows() ? 800 : 200; // Longer debounce on Windows due to NVDA performance
const HAS_VALIDATION = new WeakMap<HTMLInputElement>(); // Used to ensure we only take control of aria-invalid if there current is or has been a validation element

// NOTE:
// <fieldset> descriptions should be accessible to screen reader users. However, using aria-describedby
// on <fieldset> causes all child <input> elements to inherit the same description, resulting in redundant and confusing announcements.
// To avoid this, we use aria-labelledby to reference both the legend and the description.
// aria-labelledby is only announced when screen readers enter the fieldset, not when navigating its child elements.
// This means the accessible name of <fieldset> includes both the legend and description, which may differ from some test expectations,
// but as of March 2026, this approach provides the best user experience across assistive technologies.
const handleFieldsetMutations = () => {
  for (const el of FIELDSETS) {
    if (el.hasAttribute('aria-labelledby')) continue; // Speed up by skipping labelled fieldsets
    const labelledby = `${useId(el.querySelector('legend'))} ${useId(el.querySelector(':scope > :is([data-field="description"],legend + p)'))}`;
    attr(el, 'aria-labelledby', labelledby.trim() || null);
  }
};

const handleFieldMutations = (_: unknown, mutations?: MutationRecord[]) => {
  if (!mutations) return; // Initial calls are handled by <ds-field> connectedCallback, not mutation triggered
  for (const { target } of mutations) {
    const isFieldset = target instanceof HTMLFieldSetElement;
    for (const field of FIELDS)
      if (isFieldset ? target.contains(field) : field.contains(target))
        handleFieldMutation(field);
  }
};

const handleFieldMutation = (field: DSFieldElement) => {
  const descs: Element[] = [];
  const labels: HTMLLabelElement[] = [];
  let input: HTMLInputElement | undefined;
  let counter: Element | undefined;
  let hasValidation = false;
  let invalid = false;

  for (const el of field.getElementsByTagName('*')) {
    if (el instanceof HTMLLabelElement) labels.push(el);
    if ((el as HTMLElement).hidden) continue; // Skip hidden elements except labels
    if (isInputLike(el)) {
      if (input)
        warn(
          `Fields should only have one input element. Use <fieldset> to group multiple fields:`,
          field,
        );
      else input = el; // Only register if visible input
    } else {
      const type = el.getAttribute('data-field'); // Using getAttribute instead of attr for best performance
      if (type === 'counter') counter = el;
      if (type === 'validation') {
        descs.unshift(el);
        hasValidation = true;
        invalid = invalid || isInvalid(el);
      } else if (type) descs.push(el); // Adds both counter and descriptions
    }
  }

  if (!input) warn(`Field is missing input element:`, field);
  else {
    if (counter) COUNTS.set(input, counter);
    for (const label of labels) attr(label, 'for', useId(input));

    const fieldsetValidation = field
      .closest('fieldset')
      ?.querySelector<HTMLElement>(':scope > [data-field="validation"]');

    // Connect fieldset validation to inputs
    if (fieldsetValidation && !fieldsetValidation?.hidden) {
      hasValidation = true;
      invalid = invalid || isInvalid(fieldsetValidation);
      descs.unshift(fieldsetValidation);
    }

    // Add support for data-indeterminate attribute as this normally can only be set by javascript
    const indeterminate = attr(input, ATTR_INDETERMINATE);
    if (indeterminate) input.indeterminate = indeterminate === 'true';

    // Expand click area to ds-field if radio/checkbox
    const isBoolish = input.type === 'radio' || input.type === 'checkbox';
    attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null);
    attr(input, 'aria-describedby', descs.map(useId).join(' ') || null);

    // Only manage aria-invalid when field has validation elements
    const hadValidation = HAS_VALIDATION.has(input);
    if (hasValidation && !hadValidation) {
      HAS_VALIDATION.set(input, attr(input, 'aria-invalid')); // Store previous attribute to enable reverting state
      attr(input, 'aria-invalid', 'true');
    } else if (!hasValidation && hadValidation) {
      attr(input, 'aria-invalid', HAS_VALIDATION.get(input)); // Revert to previous state if validation element was removed
      HAS_VALIDATION.delete(input);
    }

    handleFieldInput(input); // Update counter and textarea sizing
  }
};

const handleFieldInput = (e: Event | Element) => {
  const input = ((e as Event).target || e) as HTMLInputElement;
  const counter = COUNTS.get(input);

  if (counter?.isConnected) {
    const limit = Number(attr(counter, 'data-limit')) || 0;
    const count = limit - input.value.length;
    const state = count < 0 ? 'over' : 'under';
    const label = attrOrCSS(counter, `data-${state}`)?.replace(
      '%d',
      `${Math.abs(count)}`,
    );

    attr(counter, 'data-label', label); // Using attribute to prevent hydation errors, not using aria-label to make axe tests happy
    attr(counter, 'data-state', state);
    attr(counter, 'data-color', count < 0 ? 'danger' : null);

    // Only update live region when user is actually typing
    if ((e as Event).type === 'input' && label)
      debouncedCounterLiveRegion(input, label); // Debounce live region to avoid NVDA interupting announcing typed text
  }
  if (input instanceof HTMLTextAreaElement) {
    input.style.setProperty('--_ds-field-sizing', 'auto');
    input.style.setProperty('--_ds-field-sizing', `${input.scrollHeight}px`);
  }
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
  connectedCallback() {
    FIELDS.add(this); // Register field
    handleFieldMutation(this); // Initial setup
  }
  disconnectedCallback() {
    FIELDS.delete(this);
  }
}

customElements.define('ds-field', DSFieldElement);

onHotReload('field', () => [
  on(document, 'input', handleFieldInput, QUICK_EVENT),
  onMutation(document, handleFieldsetMutations, {
    childList: true,
    subtree: true,
  }),
  onMutation(document, handleFieldMutations, {
    attributeFilter: [
      'data-field',
      'data-limit',
      'hidden', // Needed to check validation visibility
      'value', // Needed to detect changes in controlled React inputs as they do not trigger input events
      ATTR_INDETERMINATE,
    ],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
