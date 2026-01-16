import { attr, DSElement, on, QUICK_EVENT, useId } from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-errorsummary': DSErrorSummaryElement;
  }
}

export class DSErrorSummaryElement extends DSElement {
  _unevents?: () => void; // Using underscore instead of private fields for backwards compatibility

  connectedCallback() {
    this._unevents = on(this, 'animationend', this, QUICK_EVENT); // Using animationend to detect when element is visible
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
    this._unevents?.();
    this._unevents = undefined;
  }
}

customElements.define('ds-errorsummary', DSErrorSummaryElement);
