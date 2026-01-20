// TODO: Remove when publishing
import '../public/theme.css';
import '../../css/src/index.css';

import { isBrowser } from './utils';

// Ensure polyfill is loaded in browser environment only
if (isBrowser()) import('invokers-polyfill');

export * from '@u-elements/u-datalist'; // Re-export u-datalist since this is a pure polyfill and not custom Designsystemet elements
export * from '@u-elements/u-details'; // Re-export u-details since this is a pure polyfill and not custom Designsystemet elements
export * from './breadcrumbs';
export * from './errorsummary';
export * from './field';
export * from './pagination';
export * from './suggestion';
export * from './tabs';
import './clickdelegatefor';
import './dialog';
import './popover';
import './togglegroup';
import './tooltip';
