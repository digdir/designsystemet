import { DetailsContent } from './DetailsContent';
import { DetailsSummary } from './DetailsSummary';
import { UHTMLDetailsElement } from '@u-elements/u-details';

/**
 * Details component, contains `DetailsSummary` and `DetailsContent` components.
 * Content should be one `<ds-details-summary>` and `<dcs-details-content>`
 * @example
 * <ds-details>
 *  <ds-details-summary>Header</ds-details-summary>
 *  <ds-details-content>Content</ds-details-content>
 * </ds-details>
 */

export class Details extends HTMLElement {
  static observedAttributes = ['open'];

  /**
 * Controls open-state.
 *
 * Using this removes automatic control of open-state
 * @default undefined
 */
  public open?: boolean | '';

  // Used attribute, but not a property in
  /**
   * Defaults the details to open if not controlled
   * @var defaultOpen
   * @type {boolean|''}
   * @default false
   */

  /** Callback function when Details toggles due to click on summary or find in page-search */
  // Not sure we should handle this. Cant developers add their own eventListener for this?
  // public onToggle?: (event: Event) => any;

  /**
   * Refrence to the u-details child element
   * @default UHTMLDetailsElement
   */
  private _uDetails: UHTMLDetailsElement;

  /** Click event listener function also serves as a singleton */
  private _handleClick?: (e: Event) => void;

  constructor() {
    super();

    this._uDetails = document.createElement('u-details') as UHTMLDetailsElement;
    this._uDetails.classList.add('ds-details');
  }

  connectedCallback() {
    const defaultOpen = this.getAttribute('defaultOpen');
    if (defaultOpen === 'true') {
      this.open = true;
      this._uDetails.setAttribute('open', '')
    }

    const childLength = this.childNodes.length;
    for(let i = 0; i < childLength; i++) {
      this._uDetails.appendChild(this.childNodes[0]);
    }
    this.appendChild(this._uDetails);
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'open') {
      if (newValue != null) {
        this.handleAllClickEvents();
      } else {
        this.removeAllClickEvents();
      }

      if (this._handleClick) {
        this.dispatchEvent(new ToggleEvent('toggle',
          {
            oldState: oldValue,
            newState: newValue
          }
        ));
      }

      if (newValue === 'true' || newValue === '') {
        this.open = true;
        this._uDetails.setAttribute('open', '');
      }
      else if (newValue === 'false') {
        this.open = false;
        this._uDetails.removeAttribute('open');
      }
    }
  }

  // EventListener to not allow clicking
  private handleAllClickEvents() {
    if (this._handleClick == undefined) {
      this._handleClick = (e: Event) => {
        e.preventDefault();
      };
      this.addEventListener('click', this._handleClick, true);

    }
  }

  // Remove EventListner to allow clicking
  private removeAllClickEvents() {
    if (this._handleClick != undefined) {
      this.removeEventListener('click', this._handleClick, true);

      this._handleClick = undefined;
    }
  }
}

customElements.define('ds-details', Details);
customElements.define('ds-details-summary', DetailsSummary);
customElements.define('ds-details-content', DetailsContent);
