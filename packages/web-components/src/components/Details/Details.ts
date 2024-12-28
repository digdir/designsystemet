import '@u-elements/u-details'; // u-details & u-summary

import cl from 'clsx/lite';

import { DetailsContent } from './DetailsContent';
import { DetailsSummary } from './DetailsSummary';

// For import convenience
export { DetailsSummary } from './DetailsSummary';
export { DetailsContent } from './DetailsContent';

export type DetailsProps = {
  /**
   * Controls open-state.
   *
   * Using this removes automatic control of open-state
   *
   * @default undefined
   */
  open?: boolean | null;
  /**
   * Defaults the details to open if not controlled
   * @default false
   */
  defaultOpen?: boolean | null;
  /** Callback function when Details toggles due to click on summary or find in page-search */
  onToggle?: (event: Event) => any | null;
  /** Content should be one `<ds-details-summary>` and `<dcs-details-content>` */
  // TODO
};
/**
 * Details component, contains `Details.Summary` and `Details.Content` components.
 * @example
 * <ds-details>
 *  <ds-details-summary>Header</ds-details-summary>
 *  <ds-details-content>Content</ds-details-content>
 * </ds-details>
 */
export class DDetails extends HTMLDetailsElement {
  static observedAttributes = ["open"];

  constructor() {
    super();

    console.log("construct <dcs-details>");
  }

  connectedCallback() {
    // this.detailsRef = this.host;
    const defaultOpen = Boolean(this.getAttribute("defaultOpen")); // Allow setting defaultOpen once and render once
    const onToggle = this.getAttribute("onToggle") as unknown as (event: Event) => any;
    const open = Boolean(this.getAttribute("open"));

    const options: DetailsProps = {
      defaultOpen,
      onToggle,
      open
    };

    // const uDetails = `<u-details
    //   class=${cl('ds-details', ...this.classList)}
    //   open=${(open ?? defaultOpen) || undefined /* Fallback to undefined to prevent rendering open="false"*/}
    // >
    //   <slot>/slot>
    // </u-details>`;

    const uDetails = document.createElement('u-details');
    uDetails.classList.add(cl('ds-details', ...this.classList));
    if (open != undefined) {
      uDetails.setAttribute('open', (open ? true : false).toString());
    }

    this.appendChild(uDetails);

    this.setup(options);

    console.log("connected dsc-details");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log(name, oldValue, newValue);
  }

  private setup(options: DetailsProps) {
    if (options.onToggle) {
      this.addEventListener('toggle', options.onToggle, true);
    }
  }
}

export function detailsDefine() {
  customElements.define("ds-details", Details);
  customElements.define("ds-details-summary", DetailsSummary);
  customElements.define("ds-details-content", DetailsContent);
}
