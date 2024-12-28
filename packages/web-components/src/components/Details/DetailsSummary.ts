import { html, render } from 'lit';

export type DetailsSummaryArgs = {
  /** Heading text */
  // children: HTMLElement;
};

/**
 * Details summary component, contains a the heading to toggle the content.
 * @example
 * <ds-details-summary>Heading</ds-details-summary>
 */
export class DetailsSummary extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    render(html`<u-summary class=${this.className}><slot></slot></u-summary>`, this);
  }
};
