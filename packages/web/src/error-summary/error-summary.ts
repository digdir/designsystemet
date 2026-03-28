import {
  attr,
  customElements,
  DSElement,
  off,
  on,
  onMutation,
  QUICK_EVENT,
  useId,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-error-summary': DSErrorSummaryElement;
  }
}

export class DSErrorSummaryElement extends DSElement {
  _unmutate?: () => void; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    on(this, 'animationend', this, QUICK_EVENT); // Using animationend to detect when element is visible
    attr(this, 'tabindex', '-1');
    this._unmutate = onMutation(this, render, {
      childList: true,
      subtree: true,
    });
    this.focus();
  }
  handleEvent({ target }: Event) {
    if (target === this) this.focus(); // Ignore if animation event was triggered by child
  }
  disconnectedCallback() {
    off(this, 'animationend', this, QUICK_EVENT);
    this._unmutate?.();
    this._unmutate = undefined;
  }
}

const render = (self: DSErrorSummaryElement) => {
  const heading = self.querySelector('h2,h3,h4,h5,h6');
  if (heading) attr(self, 'aria-labelledby', useId(heading));
};

customElements.define('ds-error-summary', DSErrorSummaryElement);
