import {
  attr,
  customElements,
  DSElement,
  off,
  on,
  onMutation,
  QUICK_EVENT,
  useId,
  warn,
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
    attr(this, 'role', 'group');
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
  const label = attr(self, 'aria-label')?.trim();
  const labelledBy = attr(self, 'aria-labelledby')?.trim();
  const heading = self.querySelector('h2,h3,h4,h5,h6');
  if (heading && !label && !labelledBy) {
    attr(self, 'aria-labelledby', useId(heading));
  }
  if (!heading && !label && !labelledBy) {
    warn(
      'Missing accessible name on:',
      self,
      '\nAdd a heading (h2–h6), or set aria-label or aria-labelledby to provide an accessible name for screen readers.',
    );
  }
};

customElements.define('ds-error-summary', DSErrorSummaryElement);
