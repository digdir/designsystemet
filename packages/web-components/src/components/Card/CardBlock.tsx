/**
 * Simple wrapper class for Card content
 * Used to add styling specific for ds-card
 */
export class CardBlock extends HTMLElement {
    constructor() {
      super();
    }

  connectedCallback() {
    this.classList.add('ds-card__block');
  }
}

customElements.define('ds-card-block', CardBlock);
