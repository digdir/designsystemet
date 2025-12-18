export const isBrowser = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

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
 * hotReload
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
