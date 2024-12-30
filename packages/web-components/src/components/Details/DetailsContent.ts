
export type DetailsContentArgs = {
  /** Heading text */
  // children: HTMLElement;
};

/**
 * Details content component, contains the content of the details item.
 * @example
 * <ds-details-content>Content</ds-details-content>
 */
export class DetailsContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement("div");
    const childLength = this.childNodes.length;
    for (let i = 0; i < childLength; i++) {
      div.appendChild(this.childNodes[0]);
    }

    this.replaceWith(div);
  }
};
