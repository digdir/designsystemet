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
    let input: HTMLInputElement | undefined;
    const descs: Element[] = [];
    const labels: HTMLLabelElement[] = [];

    for (const el of this._elements || []) {
      if (el instanceof HTMLLabelElement) labels.push(el);
      else if (isInputLike(el)) input = el;
      else if (el instanceof Element && el.hasAttribute('data-field')) {
        if (attr(el, 'data-field') === 'validation') descs.unshift(el);
        else descs.push(el);
      }
    }

    if (!input) return;
    for (const label of labels) attr(label, 'for', useId(input));

    // TODO renderCounter(input); ?
    // TODO attr(input, "aria-invalid", `${!valid}`); ?
    attr(input, 'aria-describedby', descs.map(useId).join(' '));
    console.log(input, descs, labels);
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
