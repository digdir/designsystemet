import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import { customElements, off, on, QUICK_EVENT } from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {
  connectedCallback() {
    super.connectedCallback();
    on(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    off(this, 'toggle', polyfillToggleSource, QUICK_EVENT);
  }
}

customElements.define('ds-suggestion', DSSuggestionElement);

// Since showPopover({ source }) is not supported in all browsers yet:
function polyfillToggleSource({ target: el, newState }: Partial<ToggleEvent>) {
  const id = newState === 'open' && el instanceof Element && el.id;
  const detail = id && document.querySelector(`input[list="${el.id}"]`);

  if (detail) el.dispatchEvent(new CustomEvent('ds-toggle-source', { detail }));
}
