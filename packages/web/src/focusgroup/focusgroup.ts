import {
  attr,
  getComposedPath,
  getComposedTarget,
  isBrowser,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

// Intentionally not implemented:
// - Clearing memory based on attribute changes: https://open-ui.org/components/scoped-focusgroup.explainer/#disabling-focusgroup-memory
// - Setting ARIA roles before focus or keydown occurs (this is too performance consuming, and does not affect a11y much)
// - Checking if overflow/scroll-container in isFocusable
// - Autofocus support inside popover

const ATTR_GROUP = 'focusgroup';
const PROP_GROUP = 'focusGroup';
const ATTR_START = `${ATTR_GROUP}start`;
const GROUPS = new WeakMap<Element, ReturnType<typeof parseGroup>>();
const ROOTS = new Map<Node, () => void>(); // ShadowRoots we listen for focus events on, since focus only triggers once on ShadowDOM due to event retargeting
const ROLES = {
  listbox: { block: true, wrap: false, items: 'option' },
  menu: { block: true, wrap: true, items: 'menuitem' },
  menubar: { block: false, wrap: true, items: 'menuitem' },
  radiogroup: { block: null, wrap: true, items: 'radio' },
  tablist: { block: false, wrap: true, items: 'tab' },
  toolbar: { block: false, wrap: false, items: null },
};
let IS_TAB = false; // Used to check if focus event is a result of tabbing
const IS_CONFLICT = new Set([
  'AUDIO',
  'VIDEO',
  'TEXTAREA',
  'SELECT',
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'range',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
]);

// Chrome has implemented camel case "focusGroup", but several polyfills checks both camel case and kebab case, so we support both for now
const IS_SUPPORTED =
  isBrowser() &&
  (ATTR_GROUP in HTMLElement.prototype || PROP_GROUP in HTMLElement.prototype);

const setIsTab = (state: boolean) => (IS_TAB = state);
const handleKeydown = (e: Event & Partial<KeyboardEvent>) => {
  if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;

  const isTab = e.key === 'Tab';
  const isBlock = e.key === 'ArrowUp' || e.key === 'ArrowDown';
  const isArrow = isBlock || e.key === 'ArrowLeft' || e.key === 'ArrowRight';
  if (!isTab && !isArrow && e.key !== 'Home' && e.key !== 'End') return;
  if (isTab) {
    setIsTab(true);
    setTimeout(setIsTab, 100, false); // Reset after event loop so we can check if next focus event is a result of tabbing
  }

  const target = getComposedTarget(e) as Element | null;
  if (!target || isConflict(target)) return; // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements

  let group = getGroup(getComposedPath(target));

  if (group?.role && group?.el === target)
    group = getGroup(getComposedPath(group.el.parentNode)); // If focus is on the group itself, check if it is nested inside another group
  if (!group?.role) return; // Ignore invalid parent groups

  const items = getItems(group.el, target); // Include target so we can move from tabindex="-1" as according to spec
  let next = 0;

  if (isTab) return setTimeout(setTab, 0, items, setTab(items)); // Make sure next tab stop is outside focusgroup
  if (!isArrow) next = e.key === 'End' ? items.length - 1 : 0;
  else {
    const { direction: dir, writingMode: mode } = getComputedStyle(target);
    const isFlipped = mode.startsWith('vertical');
    const isReverse = isFlipped ? mode === 'vertical-rl' : dir === 'rtl';
    const isForward = e.key === 'ArrowDown' || e.key === 'ArrowRight';

    const moveBlock = isBlock !== isFlipped;
    const moveForward = isForward !== (!isBlock && isReverse);

    if ((group.block ?? moveBlock) !== moveBlock) return; // Ignore if group direction does not match move direction
    next = items.indexOf(target) + (moveForward ? 1 : -1);

    if (group.wrap) next = (items.length + next) % items.length;
    else next = Math.max(0, Math.min(next, items.length - 1));
  }

  // Note: preventDefault() prevents native <input type="radio"> elements from changing checked state with arrow keys.
  // Although this differs from native behavior, it matches focusgroup="radiogroup" for <button role="radio">.
  // toggle-group.ts already normalizes this for both <input type="radio"> and <button role="radio">,
  // meaning the following preventDefault() introduces no inconsistencies:
  if (items[next] !== target) e.preventDefault(); // Prevent scrolling if changing item
  (items[next] as HTMLElement)?.focus?.();
};

const handleFocus = (e: Event & Partial<FocusEvent>) => {
  const target = getComposedTarget(e);
  const path = getComposedPath(target);

  for (const [el, off] of ROOTS) if (!path.has(el) && ROOTS.delete(el)) off(); // Remove focus listener on previous roots
  for (const el of path)
    if (el.nodeType === 11 && !ROOTS.has(el))
      ROOTS.set(el, on(el, 'focus', handleFocus, QUICK_EVENT)); // Listener will instantly dispatch since we are binding during triggering

  if ((e.target as Element)?.shadowRoot) return; // Avoid double handling by only processing focus events that are not already handled in a shadowRoot

  const group = getGroup(path);
  if (!group?.role) return;
  if (IS_TAB && !isConflict(group.focus)) {
    const segment = getSegment(getItems(group.el, null), target); // See https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-segments
    const start =
      (group.memory && segment.includes(group.focus) && group.focus) ||
      segment.find((el) => el?.hasAttribute(ATTR_START)) ||
      segment[0];
    if (start !== target) return (start as HTMLElement)?.focus?.(); // Fix focus position if tabbing into segment
  }
  group.focus = target; // Always store focus
};

export const getGroup = (path: Set<Node>) => {
  for (const el of path as Set<Element>) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;

    const key = el.getAttribute(ATTR_GROUP);
    if (key !== null) {
      let group = GROUPS.get(el);
      if (group?.key === key) return group; // Return cache if attribute is unchanged

      group = parseGroup(el, key);
      GROUPS.set(el, group);
      for (const item of getItems(el))
        if (item && !item.hasAttribute('role')) attr(item, 'role', group.items);
      if (!el.hasAttribute('role')) attr(el, 'role', group.role);
      return group;
    }
    if (isTopLayer(el)) return;
  }
};

const parseGroup = (el: Element, key: string) => {
  const opts = new Set(key.toLowerCase().split(' '));
  const role = [...opts].find((t) => t in ROLES) as keyof typeof ROLES;
  const base = ROLES[role];
  const x = opts.has('inline');
  const y = opts.has('block');

  return {
    key,
    el,
    role,
    block: x && y ? null : y || (x ? false : base?.block),
    focus: null as Element | null,
    items: base?.items,
    memory: !opts.has('nomemory'),
    wrap: opts.has('wrap') || (opts.has('nowrap') ? false : base?.wrap),
  };
};

export const getItems = (
  root?: Element | null,
  keep?: Element | null, // Provide Element to include, or null to keep segments (https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-segments)
  items: (Element | null)[] = [], // Used only for recursion
  isNested = false, // Used only for recursion, to check if allready inside a nested group
) => {
  const children =
    root?.nodeName === 'SLOT'
      ? (root as HTMLSlotElement).assignedElements({ flatten: true })
      : (root?.shadowRoot || root)?.children;

  for (let i = 0, l = children?.length || i; children && i < l; i++) {
    const el = children[i] as HTMLElement;
    if (el.nodeName === 'SLOT') getItems(el, keep, items, isNested);
    else if (isKeyboardReachable(el) && !isTopLayer(el) && isVisible(el)) {
      const group = el.getAttribute(ATTR_GROUP);
      if (el === keep || (!isNested && group !== 'none' && isFocusable(el)))
        items.push(el);
      else if (group !== null && keep === null) items.push(null);
      else getItems(el, keep, items, isNested || group !== null);
    }
  }
  return items;
};

// Treats the null returned from getItems as a separator and returns segment containing "item"
const getSegment = <T>(acc: (T | null)[], item: T) => {
  const at = acc.indexOf(item);
  const to = acc.indexOf(null, at);
  return acc.slice(acc.lastIndexOf(null, at) + 1, to === -1 ? undefined : to);
};

const isKeyboardReachable = (el: HTMLElement) =>
  !el.inert && !el.hidden && !(el as HTMLInputElement).disabled;

const isTopLayer = (el: Element | null) =>
  el?.nodeName === 'DIALOG' || el?.hasAttribute('popover'); // See https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements)

const isVisible =
  isBrowser() && typeof Element.prototype.checkVisibility === 'function'
    ? (el: HTMLElement) => el.checkVisibility()
    : (el: HTMLElement) => el.offsetParent !== null;

export const isFocusable = (el: HTMLElement) =>
  el.isContentEditable ||
  (el.tabIndex >= 0 && !(el as HTMLInputElement).disabled);

export const isConflict = (el: Node | null) =>
  (el as HTMLElement)?.isContentEditable ||
  IS_CONFLICT.has(el?.nodeName as string) ||
  (el?.nodeName === 'INPUT' && IS_CONFLICT.has((el as HTMLInputElement).type));

const setTab = (items: ReturnType<typeof getItems>, prevs?: string[]) =>
  Array.from(items, (item, index) => {
    const prev = item?.getAttribute('tabindex');
    if (item) attr(item, 'tabindex', prevs ? prevs[index] : '-1'); // Restore previous tabindex if provided
    return prev;
  });

if (!IS_SUPPORTED)
  onHotReload(ATTR_GROUP, () => [
    on(document, 'keydown', handleKeydown),
    on(document, 'focus', handleFocus, QUICK_EVENT),
    () => {
      for (const [, off] of ROOTS) off(); // Cleanup listeners on ShadowRoots on hot reload
      ROOTS.clear();
    },
  ]);
