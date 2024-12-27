import { UHTMLDetailsElement, UHTMLSummaryElement } from '@u-elements/u-details';
import { Details } from './components/Details';

// Register our u-elements before they are used internally
customElements.define("u-details", UHTMLDetailsElement);
customElements.define("u-summary", UHTMLSummaryElement);

// Register all custom elements below
customElements.define("dcs-details", Details);
