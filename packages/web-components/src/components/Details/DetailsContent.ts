import { html, render } from 'lit';

export type DetailsContentArgs = {
  /** Heading text */
  // children: HTMLElement;
};

/**
 * Details content component, contains the content of the details item.
 * @example
 * <ds-details-content>Content</ds-details-content>
 */
export class DetailsContent extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    render(`<slot></slot>`, this);
  }
};
