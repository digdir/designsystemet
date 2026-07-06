import { isSupported, apply as polyfillInvokers } from 'invokers-polyfill/fn';
import { isBrowser } from '../utils/utils';

// isPolyfilled is not used here as isSupported is enough to determine if the polyfill needs to be applied as it checks for the presence of the invoker commands in the environment. If they are not present, it means the polyfill is not applied and needs to be applied.
if (isBrowser() && !isSupported()) polyfillInvokers(); // Ensure invoker commands polyfill is loaded in browser environment only
