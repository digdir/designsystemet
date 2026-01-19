import { UHTMLComboboxElement } from '@u-elements/u-combobox';
import { customElements } from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-suggestion': DSSuggestionElement;
  }
}

export class DSSuggestionElement extends UHTMLComboboxElement {}

customElements.define('ds-suggestion', DSSuggestionElement);
