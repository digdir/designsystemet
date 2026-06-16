import { isSupported, apply as polyfillInvokers } from 'invokers-polyfill/fn';
import { isBrowser } from '../utils/utils';

if (isBrowser() && !isSupported()) polyfillInvokers(); // Ensure invoker commands polyfill is loaded in browser environment only
