import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { fieldObserver } from './field-observer';

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DsField;
  }
}

@customElement('ds-field')
export class DsField extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    console.log(this)
    fieldObserver(this);
  }

  update(changedProperties: Map<string | number | symbol, unknown>): void {
    super.update(changedProperties);
    fieldObserver(this);
  }

  render() {
    return html`<slot></slot>`;
  }
}

