import {
  isPolyfilled,
  isSupported,
  apply as polyfillInvokers,
} from 'invokers-polyfill/fn';
import { isBrowser } from '../utils/utils';

if (isBrowser() && !isSupported() && !isPolyfilled()) polyfillInvokers(); // Ensure invoker commands polyfill is loaded in browser environment only
