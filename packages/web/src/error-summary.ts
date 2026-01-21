import { attr, DSElement, off, on, QUICK_EVENT, useId } from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-error-summary': DSErrorSummaryElement;
  }
}

export class DSErrorSummaryElement extends DSElement {
  connectedCallback() {
    on(this, 'animationend', this, QUICK_EVENT); // Using animationend to detect when element is visible
    requestAnimationFrame(() => this.handleEvent({ target: this })); // Initial setup when children has rendered
  }
  handleEvent({ target }: Partial<Event>) {
    if (target !== this) return; // Ignore if animation event was triggered by child
    const heading = this.querySelector('h2,h3,h4,h5,h6');
    if (heading) attr(heading, 'aria-labelledby', useId(heading));
    attr(this, 'tabindex', '-1');
    this.focus();
  }
  disconnectedCallback() {
    off(this, 'animationend', this, QUICK_EVENT);
  }
}

customElements.define('ds-error-summary', DSErrorSummaryElement);
