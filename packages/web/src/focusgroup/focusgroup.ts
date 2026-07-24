import {
  attr,
  getComposedTarget,
  isBrowser,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

// biome-ignore format:next-line
const CONFLICT = new Set(['AUDIO', 'VIDEO', 'TEXTAREA', 'SELECT', 'date', 'datetime-local', 'email', 'month', 'number', 'password', 'range', 'search', 'tel', 'text', 'time', 'url', 'week' ]);
const FOCUS = new WeakMap<Element, Node | null>();
const ATTR_GROUP = 'data-focusgroup';
const _ATTR_START = `${ATTR_GROUP}start`;
let TAB_TIMESTAMP = 0;
const ROLES = {
  listbox: { block: true, wrap: false, items: 'option' },
  menu: { block: true, wrap: true, items: 'menuitem' },
  menubar: { block: false, wrap: true, items: 'menuitem' },
  radiogroup: { block: undefined, wrap: true, items: 'radio' },
  tablist: { block: false, wrap: true, items: 'tab' },
  toolbar: { block: false, wrap: false, items: undefined },
};

// const IS_SUPPORTED =
//   isBrowser() &&
//   (ATTR_GROUP in Element.prototype ||
//     'focusGroup' in Element.prototype); // Chrome has implemented camel case focusGroup

const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;

  const isTab = e.key === 'Tab';
  const isBlock = e.key === 'ArrowUp' || e.key === 'ArrowDown';
  const isArrow = isBlock || e.key === 'ArrowLeft' || e.key === 'ArrowRight';
  if (!isTab && !isArrow && e.key !== 'Home' && e.key !== 'End') return;
  if (isTab) TAB_TIMESTAMP = Date.now(); // So we can check if next focus event is a result of tabbing

  const target = getComposedTarget(e);
  if (isConflict(target)) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements

  const group = getGroup(getFullComposedPath(target));
  if (!group?.role) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements

  const items = getItems(group.el, target); // Include target so we can move from tabindex="-1" as according to spec
  const last = items.length - 1;
  let next = 0;

  if (isTab) return setTimeout(setTab, 0, items, null, setTab(items, '-1')); // Make sure next tab stop is outside focusgroup
  if (!isArrow) next = e.key === 'End' ? last : 0;
  else if (group.block === undefined || group.block === isBlock) {
    const { direction, writingMode } = window.getComputedStyle(group.el);
    const forward =
      e.key === `Arrow${writingMode.startsWith('vertical') ? 'Up' : 'Down'}` ||
      e.key === `Arrow${direction === 'rtl' ? 'Left' : 'Right'}`;

    next = items.indexOf(target as Element) + (forward ? 1 : -1);
    if (group.wrap) next = next < 0 ? last : next % items.length;
    else next = Math.max(0, Math.min(next, last));
  }

  (items[next] as HTMLElement)?.focus?.(); // TODO: e.preventDefault(); // Prevent scrolling
};

let PREV_FOCUS: Node | null; // Used to check if we are still in the same group on next focus event
const ROOTS = new Map<Node, () => void>(); // Focus events only trigger once when entering a ShadowDOM due to event retargeting, so we need to listen on ShadowRoots as well
const handleFocus = (e: Event & Partial<FocusEvent>) => {
  const next = getComposedTarget(e);
  const path = getFullComposedPath(next);
  const _prev = PREV_FOCUS;
  const group = getGroup(path);
  PREV_FOCUS = next;

  for (const el of path) if (el.nodeType === 11) setTimeout(bindFocus, 0, el); // Bind on with setTimeout to avoid instant triggering
  for (const [el, off] of ROOTS) if (path.has(el) && ROOTS.delete(el)) off(); // Unbind focus listener on previous roots

  if (!group?.role) return;
  const memory = FOCUS.get(group.el);
  FOCUS.set(group.el, next); // Always store focus in memory

  if (TAB_TIMESTAMP < Date.now() - 100) return; // If last tab was more than 100ms ago, we assume this focus event is not a result of tabbing
  const itemsOfSegment = getItems(group.el); // TODO EIRIK // See https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-segments
  // if (!itemsWithPrev.includes(prev as Element)) return; // If previous focus was inside the group, we don't need to move

  console.log(itemsOfSegment, memory);

  // const start =
  //   (!group?.nomemory && memory) ||
  //   itemsWithPrev.find((el) => el.hasAttribute(ATTR_START)) ||
  //   itemsWithPrev[0];

  // const prevIndex = itemsWithPrev.indexOf(prev as Element);
  // const nextIndex = itemsWithPrev.indexOf(next as Element);
  // const startIndex = itemsWithPrev.indexOf(start as Element);

  // console.log('maybe move focus to memory or start', {
  //   nextIndex,
  //   prevIndex,
  //   startIndex,
  // });

  // if (next !== start) (start as Element)?.focus?.(); // Move focus to memory or start if we tab into the group from outside
};

const bindFocus = (el: Element) =>
  ROOTS.has(el) || ROOTS.set(el, on(el, 'focus', handleFocus, QUICK_EVENT));

const CACHE = new WeakMap<Element, ReturnType<typeof parseOptions>>();
export const getGroup = (path: Set<Node>) => {
  for (const el of path as Set<Element>)
    if (el.nodeType === 1) {
      if (isTopLayerElement(el)) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements)

      const key = el.getAttribute(ATTR_GROUP);
      if (key === null) continue;

      let cache = CACHE.get(el);
      if (cache?.key === key) return cache; // Return cache if attribute is unchanged

      cache = parseOptions(el, key);
      CACHE.set(el, cache);
      for (const item of getItems(el)) attr(item, 'role', cache.items);
      attr(el, 'role', cache.role);
      return cache;
    }
};

const parseOptions = (el: Element, key: string) => {
  const opts = new Set(key.toLowerCase().split(' '));
  const role = [...opts].find((t) => t in ROLES) as keyof typeof ROLES;
  const base = ROLES[role];
  const wrap = opts.has('wrap') || (opts.has('nowrap') ? false : base?.wrap);
  const block = opts.has('block') || (opts.has('inline') ? false : base?.block);
  const memory = !opts.has('nomemory');

  return { key, el, block, memory, role, wrap, items: base?.items };
};

export const getItems = (
  root?: Element | null,
  keep?: EventTarget | null, // See tabindex="-1" under https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-concepts
  items: Element[] = [],
  isNested = false,
) => {
  let el = (root?.shadowRoot || root)?.firstElementChild as HTMLElement;
  for (; el; el = el.nextElementSibling as HTMLElement) {
    if (el.inert || el.hidden || !isVisible(el)) continue;
    isNested ||= el.hasAttribute(ATTR_GROUP);
    if (el === keep || (!isNested && isFocusable(el))) items.push(el);
    else getItems(el, keep, items, isNested);
  }
  return items;
};

// Return full element path even if listener is bound to a ShadowRoot (unlike event.composedPath())
const getFullComposedPath = (el: Node | null) => {
  const path = new Set<Node>();
  for (; el; el = el.nodeType === 11 ? (el as ShadowRoot).host : el.parentNode)
    path.add(el);
  return path;
};

const isVisible =
  isBrowser() && typeof Element.prototype.checkVisibility === 'function'
    ? (el: HTMLElement) => el.checkVisibility()
    : (el: HTMLElement) => el.offsetParent !== null;

const isTopLayerElement = (el: Element): boolean =>
  el.nodeName === 'DIALOG' || el.hasAttribute('popover');

export const isFocusable = (el: HTMLElement) =>
  el.isContentEditable ||
  (el.tabIndex >= 0 && !(el as HTMLInputElement).disabled);

export const isConflict = (el: Node | null) =>
  !el ||
  (el as HTMLElement).isContentEditable ||
  CONFLICT.has(el.nodeName) ||
  (el.nodeName === 'INPUT' && CONFLICT.has((el as HTMLInputElement).type));

const setTab = (items: Element[], value: string | null) =>
  Array.from(items, (item) => attr(item, 'tabindex', value));

// if (!IS_SUPPORTED)
onHotReload(ATTR_GROUP, () => [
  on(document, 'keydown', handleKeydown),
  on(document, 'focus', handleFocus, QUICK_EVENT),
]);

// TODO: Function to disable polyfill?
// Intentionally not implemented:
// - Clearing memory based on attribute changes: https://open-ui.org/components/scoped-focusgroup.explainer/#disabling-focusgroup-memory
// - Setting roles before focus or keydown occurs (this is too performance consuming, and does not affect a11y much)
// - Autofocus support inside popover
// - Checking if  overflow/scroll-container in isFoucsable
