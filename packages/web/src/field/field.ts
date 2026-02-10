import {
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
  setTextWithoutMutation,
  tag,
  useId,
  warn,
} from '../utils/utils';

// TODO: Document that Validation must be hidden with "hidden" attribute (or completely removed from DOM), not display: none
declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DSFieldElement;
  }
  interface GlobalEventHandlersEventMap {
    'ds-field-update': CustomEvent; // Allow manually triggering update when i.e. React changes value prop
  }
}

const INDETERMINATE = 'data-indeterminate';
const FIELDS = new Set<DSFieldElement>(); // Set of Field
const COUNTS = new WeakMap<HTMLInputElement, Element>(); // Using WeakMap so removed inputs/counts does not cause memory leaks
const FIELDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];
const HAS_FIELD_SIZING = isBrowser() && CSS.supports('field-sizing', 'content');
const COUNTER_DEBOUNCE = isWindows() ? 800 : 200; // Longer debounce on Windows due to NVDA performance
const HAS_VALIDATION = new WeakSet<HTMLInputElement>(); // Used to store inputs that have/had validation elements to manage aria-invalid

const handleMutations = debounce(() => {
  for (const el of FIELDSETS) {
    const labelledby = `${useId(el.querySelector('legend'))} ${useId(el.querySelector(':scope > :is([data-field="description"],legend + p)'))}`;
    attr(el, 'aria-labelledby', labelledby.trim() || null);
  }
  for (const field of FIELDS) {
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
        else if (type === 'validation') {
          descs.unshift(el);
          hasValidation = true;
          invalid = invalid || isInvalid(el);
        } else if (type) descs.push(el); // Adds both counter and descriptions}
      }
    }

    if (!input) warn(`Field is missing input element:`, field);
    else {
      if (counter) COUNTS.set(input, counter);
      for (const label of labels) attr(label, 'for', useId(input));

      const isBoolish = input.type === 'radio' || input.type === 'checkbox';
      const fieldsetValidation = field
        .closest('fieldset')
        ?.querySelector<HTMLElement>(':scope > [data-field="validation"]');
      if (fieldsetValidation && !fieldsetValidation?.hidden) {
        hasValidation = true;
        invalid = invalid || isInvalid(fieldsetValidation);
        descs.unshift(fieldsetValidation);
      }

      const indeterminate = attr(input, INDETERMINATE);
      if (indeterminate) input.indeterminate = indeterminate === 'true';

      attr(field, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
      attr(input, 'aria-describedby', descs.map(useId).join(' ') || null);
      if (hasValidation || HAS_VALIDATION.has(input)) {
        HAS_VALIDATION[hasValidation ? 'add' : 'delete'](input); // Track if field has validation elements to avoid managing aria-invalid on every mutation
        attr(input, 'aria-invalid', `${invalid}`); // Only manage aria-invalid when field has validation elements
      }
      updateField(input); // Update counter and textarea sizing
    }
  }
}, 0); // Debounce to merge multiple mutations

const SR_ONLY = 'position:fixed;white-space:nowrap;clip:rect(0 0 0 0)';
const SR_LIVE = isBrowser()
  ? tag('div', { 'aria-live': 'polite', style: SR_ONLY })
  : null;

const updateField = (e: Event | Element) => {
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

    attr(counter, 'data-label', label); // Using attribute as this does not cause hydation errors
    attr(counter, 'data-state', state);
    attr(counter, 'data-color', count < 0 ? 'danger' : null);

    // Only update live region when user is actually typing
    if ((e as Event).type === 'input' && SR_LIVE && label) {
      if (!SR_LIVE?.isConnected) document.body.appendChild(SR_LIVE); // Prepare live region
      debouncedCounterLiveRegion(input, label); // Debounce live region to avoid NVDA interupting announcing typed text
    }
  }
  if (!HAS_FIELD_SIZING && input instanceof HTMLTextAreaElement) {
    input.style.setProperty('--_ds-field-sizing', 'auto');
    input.style.setProperty('--_ds-field-sizing', `${input.scrollHeight}px`);
  }
};

const debouncedCounterLiveRegion = debounce((input: Element, text: string) => {
  const hasFocus = document.activeElement === input; // Only announce if input is still focused
  if (SR_LIVE?.isConnected && hasFocus) setTextWithoutMutation(SR_LIVE, text);
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
    handleMutations(); // Initial setup
  }
  disconnectedCallback() {
    FIELDS.delete(this);
  }
}

customElements.define('ds-field', DSFieldElement);

onHotReload('field', () => [
  on(document, 'input ds-field-update', updateField, QUICK_EVENT),
  onMutation(document, handleMutations, {
    attributeFilter: ['hidden', 'data-field', INDETERMINATE], // Listen for hidden to detect hidden validations
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
