import '@u-elements/u-details'; // u-details & u-summary

import cl from 'clsx/lite';

import { DetailsContent } from './DetailsContent';
import { DetailsSummary } from './DetailsSummary';
import { UHTMLDetailsElement } from '@u-elements/u-details';

export type DetailsProps = {
  /**
   * Controls open-state.
   *
   * Using this removes automatic control of open-state
   *
   * @default undefined
   */
  open?: boolean | null; // Do we need to
  /**
   * Defaults the details to open if not controlled
   * @default false
   */
  defaultOpen?: boolean | null;
  /** Callback function when Details toggles due to click on summary or find in page-search */
  onToggle?: (event: Event) => any | null;
  /** Content should be one `<ds-details-summary>` and `<dcs-details-content>` */
};

/**
 * Details component, contains `DetailsSummary` and `DetailsContent` components.
 * @example
 * <ds-details>
 *  <ds-details-summary>Header</ds-details-summary>
 *  <ds-details-content>Content</ds-details-content>
 * </ds-details>
 */

export class Details extends UHTMLDetailsElement {
  public get open(): boolean {
    return this.open;
  }
  public set open(value: boolean) {
    this.open = value;
  }
  public get defaultOpen(): boolean {
    return this.defaultOpen;
  }
  public set defaultOpen(value: boolean) {
    this.defaultOpen = value;
  }
  public onToggle: (event: Event) => any | null = () => {};

  constructor() {
    super();
  }

  connectedCallback() {
    this.onToggle = this.getAttribute("onToggle") as unknown as (event: Event) => any;

    const uDetails = document.createElement('u-details'); // Comes with slot
    this.getAttributeNames().forEach((attr) => {
      uDetails.setAttribute(attr, this.getAttribute(attr) || '');
    });
    uDetails.classList.add(cl('ds-details'));

    const childLength = this.childNodes.length;
    for(let i = 0; i < childLength; i++) {
      uDetails.appendChild(this.childNodes[0]);
    }
    this.replaceWith(uDetails);
  }

  disconnectedCallback() {
    if (this.onToggle)
    this.removeEventListener('toggle', this.onToggle, true);
  }

  private setup() {
    if (this.onToggle) {
      this.addEventListener('toggle', this.onToggle, true);
    }
  }
}

customElements.define("ds-details", Details);
customElements.define("ds-details-summary", DetailsSummary);
customElements.define("ds-details-content", DetailsContent);
