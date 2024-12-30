import { UHTMLSummaryElement } from "@u-elements/u-details";

export type DetailsSummaryArgs = {
  /** Heading text */
  // children: HTMLElement;
};

/**
 * Details summary component, contains a the heading to toggle the content.
 * @example
 * <ds-details-summary>Heading</ds-details-summary>
 */
export class DetailsSummary extends UHTMLSummaryElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const usummary = document.createElement("u-summary");
    const childLength = this.childNodes.length;
    for(let i = 0; i < childLength; i++) {
      usummary.appendChild(this.childNodes[0]);
    }

    this.replaceWith(usummary);
  }
};
