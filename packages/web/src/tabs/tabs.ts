import * as UTabs from '@u-elements/u-tabs';
import { customElements } from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-tabs': DSTabsElement;
    'ds-tablist': DSTabListElement;
    'ds-tab': DSTabElement;
    'ds-tabpanel': DSTabPanelElement;
  }
}

export class DSTabsElement extends UTabs.UHTMLTabsElement {}
export class DSTabListElement extends UTabs.UHTMLTabListElement {}
export class DSTabElement extends UTabs.UHTMLTabElement {}
export class DSTabPanelElement extends UTabs.UHTMLTabPanelElement {}

customElements.define('ds-tabs', DSTabsElement);
customElements.define('ds-tablist', DSTabListElement);
customElements.define('ds-tab', DSTabElement);
customElements.define('ds-tabpanel', DSTabPanelElement);
