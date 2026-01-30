import { isSupported, apply as polyfillInvokers } from 'invokers-polyfill/fn';
import { isBrowser } from './utils/utils';
import '@u-elements/u-details/polyfill'; // Polyfill for <details> element for Android Firefox + Talkback
import './clickdelegatefor/clickdelegatefor';
import './dialog/dialog';
import './popover/popover';
import './readonly/readonly';
import './toggle-group/toggle-group';
import './tooltip/tooltip';

export * from '@u-elements/u-datalist'; // Re-export u-datalist since this is a pure polyfill and not custom Designsystemet elements
export * from './breadcrumbs/breadcrumbs';
export * from './error-summary/error-summary';
export * from './field/field';
export * from './pagination/pagination';
export * from './suggestion/suggestion';
export * from './tabs/tabs';
export * from './tooltip/tooltip';

if (isBrowser() && !isSupported()) polyfillInvokers(); // Ensure invoker commands polyfill is loaded in browser environment only
