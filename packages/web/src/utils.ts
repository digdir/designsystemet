export const QUICK_EVENT = { passive: true, capture: true };

// Using function instead of constant to support evnironments where DOM can be unloaded (like Vitest with jsdom)
export const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

// Make sure we have a HTMLElement to extend (for server side rendering)
export const DSElement =
  typeof HTMLElement === 'undefined'
    ? (class {} as typeof HTMLElement)
    : HTMLElement;

export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: T) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), delay);
  };
}

/**
 * attr
 * @description Utility to quickly get, set and remove attributes
 * @param el The Element to read/write attributes from
 * @param name The attribute name to get, set or remove, or a object to set multiple attributes
 * @param value A valid attribute value or null to remove attribute
 */
export const attr = (
  el: Element,
  name: string,
  value?: string | null,
): string | null => {
  if (value === undefined) return el.getAttribute(name) ?? null; // Fallback to null only if el is undefined
  if (value === null) el.removeAttribute(name);
  else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  return null;
};

/**
 * attrRequiredWarning
 * @description Warn if element is missing attribute
 * @param el The Element to read/write attributes from
 * @param ...names The attribute name(s) check
 */
// TODO: Should this test what environment we are in, and only warn in development?
export const attrRequiredWarning = (el: Element, name: string) =>
  el.hasAttribute(name) || console.warn(el, `is missing a ${name} attribute`);

/**
 * on
 * @param el The Element to use as EventTarget
 * @param types A space separated string of event types
 * @param listener An event listener function or listener object
 */
export const on = (
  el: Node | Window | ShadowRoot,
  ...rest: Parameters<typeof Element.prototype.addEventListener>
): (() => void) => {
  const [types, ...options] = rest;
  for (const type of types.split(' ')) el.addEventListener(type, ...options);
  return () => off(el, ...rest);
};

/**
 * off
 * @param el The Element to use as EventTarget
 * @param types A space separated string of event types
 * @param listener An event listener function or listener object
 */
export const off = (
  el: Node | Window | ShadowRoot,
  ...rest: Parameters<typeof Element.prototype.removeEventListener>
): void => {
  const [types, ...options] = rest;
  for (const type of types.split(' ')) el.removeEventListener(type, ...options);
};

// Used to store cleanup functions for hot-reloading
declare global {
  interface Window {
    _dsHotReloadCleanup?: Map<string, Array<() => void>>;
  }
}

/**
 * onHotReload
 * @description Runs a callback when window is loaded in browser, and ensures cleanup when hot-reloading
 * @param key The key to identify setup and corresponding cleanup
 * @param callback The callback to run when the page is ready
 */
export const onHotReload = (key: string, setup: () => Array<() => void>) => {
  if (!isBrowser()) return; // Skip if not in modern browser environment, but on each call as Vitest might have unloaded jsdom between tests
  if (!window._dsHotReloadCleanup) window._dsHotReloadCleanup = new Map(); // Hot reload cleanup support supporting all build tools

  const run = () => {
    window._dsHotReloadCleanup?.get(key)?.map((cleanup) => cleanup()); // Run previous cleanup
    window._dsHotReloadCleanup?.set(key, setup()); // Store new cleanup
  };

  if (document.readyState !== 'complete') on(window, 'load', run);
  else document.fonts?.ready?.then(run) || setTimeout(run, 0); // Prefer fonts ready promise if available, but fallback to setTimeout
};

/**
 * Speed up MutationObserver by debouncing and only running when page is visible
 * @return new MutaionObserver
 */
export const onMutation = (
  el: Node,
  callback: (observer: MutationObserver) => void,
  options: MutationObserverInit,
) => {
  let queue = 0;
  const onTimer = () => {
    if (!isBrowser()) return cleanup(); // If using JSDOM, the document might have been removed
    callback(observer);
    observer.takeRecords(); // Clear records to avoid running callback multiple times
    queue = 0;
  };
  const onFrame = debounce(onTimer, 200); // Use both requestAnimationFrame and setTimeout to debounce and only run when visible
  const cleanup = () => observer?.disconnect?.();
  const observer = new MutationObserver(() => {
    if (!queue) queue = requestAnimationFrame(onFrame); // requestAnimationFrame only runs when page is not visible
  });

  observer.observe(el, options);
  onFrame(); // Initial run
  return cleanup;
};

// Polyfill for ToggleEvent.source for browsers that do not support it yet
if (isBrowser()) {
  let isSupported = false;
  const dialog = document.createElement('dialog');
  dialog.addEventListener('beforetoggle', (e) => {
    isSupported = 'source' in e;
  });
  dialog.show();

  if (!isSupported) {
    Object.defineProperty(ToggleEvent.prototype, 'source', {
      configurable: true,
      enumerable: true,
      get() {
        const id = this.target.id;
        const root = this.target.getRootNode(); // Support shadow DOM
        const css = `[popovertarget="${id}"],[commandfor="${id}"]`;
        return id ? root?.querySelector?.(css) : null;
      },
    });
  }
}

/**
 * customElements.define
 * @description Defines a customElement if running in browser and if not already registered
 * Scoped/named "customElements.define" so @custom-elements-manifest/analyzer can find tag names
 */
export const customElements = {
  define: (name: string, instance: CustomElementConstructor) =>
    !isBrowser() ||
    window.customElements.get(name) ||
    window.customElements.define(name, instance),
};

/**
 * useId
 * @return A generated unique ID
 */
let id = 0;
const hash = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
export function useId(el: Element) {
  if (!el.id) el.id = `${hash}${++id}`;
  return el.id;
}
