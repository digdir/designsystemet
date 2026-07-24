import { attr, isBrowser, on, onHotReload, QUICK_EVENT } from '../utils/utils';

type TokensCache = {
  key: string;
  el: HTMLElement;
  inline?: boolean;
  items?: string;
  memory: boolean;
  role?: keyof typeof TOKENS;
  wrap: boolean;
};

export const ATTR_GROUP = 'data-focusgroup';
export const ATTR_START = `${ATTR_GROUP}start`;
const FOCUS = new WeakMap<HTMLElement, Node | null>();
const CACHE = new WeakMap<HTMLElement, TokensCache>();
const TOKENS = {
  listbox: { inline: false, items: 'option', wrap: false },
  menu: { inline: false, items: 'menuitem', wrap: true },
  menubar: { inline: true, items: 'menuitem', wrap: true },
  radiogroup: { inline: undefined, items: 'radio', wrap: true },
  tablist: { inline: true, items: 'tab', wrap: true },
  toolbar: { inline: true, items: undefined, wrap: false },
};

// const IS_SUPPORTED =
//   isBrowser() &&
//   (ATTR_GROUP in HTMLElement.prototype ||
//     'focusGroup' in HTMLElement.prototype); // Chrome has implemented camel case focusGroup

let LAST_TAB = 0;
const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;

  const isTab = e.key === 'Tab';
  const isInline = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
  const isArrow = isInline || e.key === 'ArrowUp' || e.key === 'ArrowDown';
  if (!isTab && !isArrow && e.key !== 'Home' && e.key !== 'End') return;
  if (isTab) LAST_TAB = Date.now(); // So we can check if next focus event is a result of tabbing

  const path = getFullComposedPath(e);
  if (isConflict(path[0])) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements

  const group = getGroup(path);
  if (!group?.role) return;

  const items = getItems(group.el, path[0]); // Include target so we can move from tabindex="-1" as according to spec
  const last = items.length - 1;
  let next = 0;

  if (isTab) return setTimeout(setTab, 0, items, null, setTab(items, '-1')); // Make sure next tab stop is outside focusgroup
  if (!isArrow) next = e.key === 'End' ? last : 0;
  else if (group.inline === undefined || group.inline === isInline) {
    const { direction, writingMode } = window.getComputedStyle(group.el);
    const forward =
      e.key === `Arrow${writingMode.startsWith('vertical') ? 'Up' : 'Down'}` ||
      e.key === `Arrow${direction === 'rtl' ? 'Left' : 'Right'}`;

    next = items.indexOf(path[0] as HTMLElement) + (forward ? 1 : -1);
    if (group.wrap) next = next < 0 ? last : next % items.length;
    else next = Math.max(0, Math.min(next, last));
  }

  // TODO: e.preventDefault(); // Prevent scrolling
  items[next]?.focus();
};

let PREV_FOCUS: Node; // Used to check if we are still in the same group on next focus event
const ROOTS = new Map<Node, () => void>(); // Focus events only trigger once when entering a ShadowDOM due to event retargeting, so we need to listen on ShadowRoots as well
const handleFocus = (e: Event & Partial<FocusEvent>) => {
  const path = getFullComposedPath(e);
  const next = path[0];
  const prev = PREV_FOCUS;
  const group = getGroup(path);
  PREV_FOCUS = next;

  for (const [el, unbind] of ROOTS)
    if (!path.includes(el) && ROOTS.delete(el)) unbind(); // Unbind focus listener on previous roots

  for (const el of path)
    if (el.nodeType === 11 && !ROOTS.has(el)) setTimeout(bindFocus, 0, el); // Bind on with setTimeout to avoid instant triggering

  if (!group?.role) return; // No valid group

  const isTab = LAST_TAB > Date.now() - 100; // If last tab was within 100ms, we assume this focus event is a result of tabbing
  const memory = FOCUS.get(group.el);

  FOCUS.set(group.el, next); // Always store focus in memory
  if (!isTab) return;
  const items = getItems(group.el, prev);

  if (items.indexOf(prev as HTMLElement) !== -1) return; // If previous focus was inside the group, we don't need to move focus to memory or start
  const start =
    (group?.memory && memory) ||
    items.find((el) => el.hasAttribute(ATTR_START)) ||
    items[0];

  if (next !== start) (start as HTMLElement)?.focus?.(); // Move focus to memory or start if we tab into the group from outside
};

const bindFocus = (el: Element) =>
  ROOTS.set(el, on(el, 'focus', handleFocus, QUICK_EVENT));

export const getGroup = (path: Node[]) => {
  for (const n of path)
    if (n.nodeType === 1) {
      const el = n as HTMLElement;
      if (el.nodeName === 'DIALOG' || el.hasAttribute('popover')) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements)
      const key = el.getAttribute(ATTR_GROUP);
      if (key === null) continue;
      const cache = CACHE.get(el) ?? ({ el, memory: true } as TokensCache);
      if (cache.key === key) return cache; // Return cache if attribute is unchanged

      // biome-ignore format: Performance optimized block
      for (const part of key.toLowerCase().split(' ')) {
        if (part in TOKENS) cache.role = part as keyof typeof TOKENS;
        else switch (part) {
          case 'block': cache.inline = false; break;
          case 'inline': cache.inline = true; break;
          case 'nomemory': cache.memory = false; break;
          case 'nowrap': cache.wrap = false; break;
          case 'wrap': cache.wrap = true; break;
        }
      }

      const base = TOKENS[cache.role as keyof typeof TOKENS];
      cache.key = key;
      cache.items = base?.items;
      cache.inline ??= base?.inline;
      cache.wrap ??= base?.wrap;
      CACHE.set(el, cache);
      for (const item of getItems(el)) attr(item, 'role', cache.items);
      attr(el, 'role', cache.role);
      return cache;
    }
};

export const getItems = (
  root: ParentNode | null,
  add?: EventTarget | null, // See tabindex="-1" under https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-concepts
  items: HTMLElement[] = [],
  nested = false,
) => {
  let n = ((root as Element)?.shadowRoot || root)?.firstElementChild;
  for (; n; n = n.nextElementSibling) {
    const el = n as HTMLInputElement;
    if (el.inert || el.hidden || !isVisible(el)) continue; // Skip nested focusgroups or invisible

    const nest = nested || el.hasAttribute(ATTR_GROUP);
    if (
      nest
        ? n === add
        : el.isContentEditable || (el.tabIndex >= 0 && !el.disabled)
    )
      items.push(el); // See https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-segments
    else getItems(el, add, items, nest);
  }
  return items;
};

// Return full element path even if listener is bound to a ShadowRoot (unlike event.composedPath())
const getFullComposedPath = (e: Event): Node[] => {
  const path = [];
  let el = e.composedPath()[0] as Node | null;
  for (; el; el = (el as ShadowRoot).host || el.parentNode) path.push(el);
  return path;
};

const isVisible =
  isBrowser() && typeof Element.prototype.checkVisibility === 'function'
    ? (el: HTMLElement) => el.checkVisibility()
    : (el: HTMLElement) => el.offsetParent !== null;

// biome-ignore format: Performance optimized block
export const isConflict = (n?: EventTarget | null) => {
  const el = n as HTMLInputElement | null;
  switch (el?.nodeName) {
    case 'AUDIO': case 'VIDEO': case 'TEXTAREA': case 'SELECT':return true;
    case 'INPUT': switch (el?.type) { case 'date': case 'datetime-local': case 'email': case 'month': case 'number': case 'password': case 'range': case 'search': case 'tel': case 'text': case 'time': case 'url': case 'week':return true; }
  }
  return el?.isContentEditable || false;
};

const setTab = (items: Element[], value: string | null) => {
  for (const item of items) attr(item, 'tabindex', value);
};

// if (!IS_SUPPORTED)
onHotReload(ATTR_GROUP, () => [
  on(document, 'keydown', handleKeydown),
  on(document, 'focus', handleFocus, QUICK_EVENT),
]);

// TODO: Function to disable polyfill?
// Intentionally not implemented:
// - Clearing memory based on attribute changes: https://open-ui.org/components/scoped-focusgroup.explainer/#disabling-focusgroup-memory
// - Setting roles before focus or mousedown occures - this is too performance consuming, and does not affect a11y much
// - Autofocus support inside popover
// - Checking if  overflow/scroll-container in isFoucsable
