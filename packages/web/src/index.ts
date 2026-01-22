import { isBrowser } from './utils';

// Ensure polyfill is loaded in browser environment only
if (isBrowser()) import('invokers-polyfill');

export * from '@u-elements/u-datalist'; // Re-export u-datalist since this is a pure polyfill and not custom Designsystemet elements
export * from './breadcrumbs';
export * from './error-summary';
export * from './field';
export * from './pagination';
export * from './suggestion';
export * from './tabs';
import '@u-elements/u-details/polyfill'; // Polyfill for <details> element for Android Firefox + Talkback
import './clickdelegatefor';
import './dialog';
import './popover';
import './toggle-group';
import './tooltip';
