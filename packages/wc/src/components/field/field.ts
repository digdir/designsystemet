import { fieldObserver } from './field-observer';

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DsField;
  }
}

export class DsField extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).appendChild(
        document.createElement('slot'),
      );
      console.log(this);
    }
  }

  connectedCallback() {
    fieldObserver(this);
  }
}

customElements.define('ds-field', DsField);
