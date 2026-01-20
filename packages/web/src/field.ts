import {
  attr,
  customElements,
  DSElement,
  debounce,
  on,
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
const ATTR_FIELDSET = 'data-fieldset';
const SELECTOR_FIELDSET = `[${ATTR_FIELDSET}]`;
const CSS_FIELD_SIZE = '--_ds-field-sizing';
const TYPE_DESCRIPTION = 'description';
const TYPE_VALIDATION = 'validation';

export class DSFieldElement extends DSElement {
  _elements?: HTMLCollection;
  _unevents?: () => void;
  _unmutate?: () => void;

  connectedCallback() {
    const render = debounce(this.render.bind(this), 100);
    this._elements = this.getElementsByTagName('*'); // Speed up by caching HTMLCollection
    this._unevents = on(this, 'animationend', render, QUICK_EVENT); // Using animationend to detect validations are visible
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
  }
  render() {
    const descs: Element[] = [];
    const labels: HTMLLabelElement[] = [];
    const fieldset = this.closest('fieldset');
    let input: HTMLInputElement | undefined;
    let valid = true;

    for (const el of this._elements || []) {
      if (el instanceof HTMLLabelElement) labels.push(el);
      else if (isInputLike(el)) input = el;
      else {
        const type = el.getAttribute(ATTR_FIELD); // Using getAttribute not attr for best performance
        if (type === TYPE_VALIDATION) {
          if (isValidationInvalid(el)) valid = false;
          descs.unshift(el);
        } else if (type !== null) descs.push(el);
      }
    }

    if (!input) return;
    for (const label of labels) attr(label, 'for', useId(input));
    if (input instanceof HTMLTextAreaElement) {
      input.style.setProperty(CSS_FIELD_SIZE, 'auto');
      input.style.setProperty(CSS_FIELD_SIZE, `${input.scrollHeight}px`); // Polyfill field-sizing for iOS
    }

    // Set attributes on fieldset if present
    // TODO: Should this be a separate component as toggling validation on fieldset now has no effect on ds-field? Or should DS-field be just a mutationobserver?
    if (fieldset) {
      const legend = fieldset.querySelector('legend');
      const labelledby: Element[] = legend ? [legend] : [];
      for (const el of fieldset.querySelectorAll(SELECTOR_FIELDSET)) {
        const type = el.getAttribute(ATTR_FIELDSET); // Using getAttribute not attr for best performance
        if (type === TYPE_DESCRIPTION) labelledby.push(el);
        if (type === TYPE_VALIDATION) {
          if (isValidationInvalid(el)) valid = false;
          descs.unshift(el);
        }
      }
      attr(fieldset, 'aria-labelledby', labelledby.map(useId).join(' '));
      // TODO Warn about field without, or with multiple inputs and warn about fieldset without fields
    }

    const isBoolish = input.type === 'radio' || input.type === 'checkbox';
    attr(this, 'data-clickdelegatefor', isBoolish ? useId(input) : null); // Expand click area to ds-field if radio/checkbox
    attr(input, 'aria-describedby', descs.map(useId).join(' '));
    attr(input, 'aria-invalid', `${!valid}`);
    // TODO renderCounter(input)?
  }
  disconnectedCallback() {
    this._unevents?.();
    this._unmutate?.();
    this._unmutate = this._unevents = this._elements = undefined;
  }
}

customElements.define('ds-field', DSFieldElement);

/**
 * isInputLike
 * @description Check if element is an input like element
 * @param el The element to check
 * @returns true if the element is an input like element
 */
const isInputLike = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLElement &&
  'validity' in el &&
  !(el instanceof HTMLButtonElement);

const isValidationInvalid = (el: Element): boolean =>
  attr(el, 'data-color') !== 'success' && !!el.clientHeight;
