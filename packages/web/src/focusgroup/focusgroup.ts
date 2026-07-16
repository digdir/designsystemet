import { attr, isBrowser, on, onHotReload, QUICK_EVENT } from '../utils/utils';

// TODO: Function do disable polyfill

let IS_TABBING = 0;
const FOCUS_INDEX_MEMORY = new WeakMap<Element, number>();
const ATTR_FOCUSSTART = 'focusgroupstart';
const ATTR_FOCUSGROUP = 'focusgroup';
const SELECTOR_FOCUSGROUP = `[${ATTR_FOCUSGROUP}]`;
const SELECTOR_INPUTS = '[contenteditable="true"], select, textarea, input'; // Must end with "input"
const SELECTOR_FOCUSABLE = `a, button, [tabindex], ${SELECTOR_INPUTS}:not(:disabled)`; // See https://open-ui.org/components/scoped-focusgroup.explainer/#focusgroup-segments
const SELECTOR_CONFLICTS = `audio, video, ${SELECTOR_INPUTS}:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"])`; // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements
const SELECTOR_LAYER = 'dialog, [popover]'; // See https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements

const BEHAVIORS = {
  toolbar: {
    axis: 'inline',
    wrap: false,
  },
  tablist: {
    axis: 'inline',
    child: 'tab',
    wrap: true,
  },
  radiogroup: {
    axis: undefined,
    child: 'radio',
    wrap: true,
  },
  listbox: {
    axis: 'block',
    child: 'option',
    wrap: false,
  },
  menu: {
    axis: 'block',
    child: 'menuitem',
    wrap: true,
  },
  menubar: {
    axis: 'inline',
    child: 'menuitem',
    wrap: true,
  },
  none: null,
};

const IS_SUPPORTED =
  isBrowser() &&
  ATTR_FOCUSGROUP in HTMLElement.prototype &&
  'focusGroup' in HTMLElement.prototype;

function handleKeydown(event: Event & Partial<KeyboardEvent>) {
  if (event.defaultPrevented) return;
  const key = event.key;

  if (key === 'Tab') IS_TABBING = Date.now(); // Store last tab timestamp to detect if focus event is caused by tabbing
  if (key !== 'Home' && key !== 'End' && !key?.startsWith('Arrow')) return; // Only handle navigation keys

  // Make sure the element is in a group, and not opted-out, see https://open-ui.org/components/scoped-focusgroup.explainer/#opting-out
  const path = event.composedPath() as Element[]; // Get full event path, including Shadow DOM
  const group = path.find((el) => el.hasAttribute?.(ATTR_FOCUSGROUP));
  const conflict = group && path.find((el) => el.matches?.(SELECTOR_CONFLICTS)); // See https://open-ui.org/components/scoped-focusgroup.explainer/#key-conflict-elements
  if (!group || attr(group, ATTR_FOCUSGROUP) === 'none' || conflict) return;

  // Make sure focusgroup and focused is in the same top layer, see https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements
  const layer = path.find((el) => el.matches?.(SELECTOR_LAYER));
  if (layer?.contains(group) === false) return;

  if (key?.startsWith('Arrow')) event.preventDefault(); // Stop input[type="radio"] from changing state when using arrow keys
  navigateLinear(group, path[0], key);
}

function handleFocus(event: Event) {
  // TODO autofocus on popover element
  console.log('focusin', event, IS_TABBING);
}

function navigateLinear(group: Element, focused: Element, key: string): void {
  const tokens = parseAttribute(group);
  const items = getItems(group);
  const next =
    FOCUS_INDEX_MEMORY.get(group) ??
    items.findIndex((el) => el.hasAttribute(ATTR_FOCUSSTART)) ??
    items.indexOf(focused);

  console.log('navigateLinear', { items, group, focused, key, tokens, next });

  // let nextIndex = FOCUS_INDEX_MEMORY.get(el) ?? -1;
  // if (nextIndex === -1) return;

  // const items = el.querySelectorAll(SELECTOR_FOCUSABLE);
  // const lastIndex = items.length - 1;
  // const tokens = attr(el, ATTR_GROUP)?.split(' ') ?? [];
  // const inline = tokens.includes('inline');
  // const block = tokens.includes('block');
  // const wrap = tokens.includes('wrap');

  // const style = getComputedStyle(el);
  // const isRTL = style.direction === 'rtl';
  // const isVertical = style.writingMode.startsWith('vertical');

  // let horizontal = false;
  // let forward = false;

  // switch (key) {
  //   case 'ArrowRight':
  //     horizontal = true;
  //     forward = !isRTL;
  //     break;
  //   case 'ArrowLeft':
  //     horizontal = true;
  //     forward = isRTL;
  //     break;
  //   case 'ArrowDown':
  //     horizontal = false;
  //     forward = !isVertical;
  //     break; // Assumes horizontal-tb or vertical-rl
  //   case 'ArrowUp':
  //     horizontal = false;
  //     forward = isVertical;
  //     break;
  //   case 'Home':
  //     nextIndex = 0;
  //     break;
  //   case 'End':
  //     nextIndex = lastIndex;
  //     break;
  // }

  // if (key.startsWith('Arrow')) {
  //   if ((inline && !block && !horizontal) || (block && !inline && horizontal))
  //     return;
  //   nextIndex += forward ? 1 : -1;
  // }

  // if (wrap) {
  //   if (nextIndex < 0) nextIndex = lastIndex;
  //   if (nextIndex > lastIndex) nextIndex = 0;
  // } else {
  //   nextIndex = Math.max(0, Math.min(nextIndex, lastIndex));
  // }
  // console.log(items, nextIndex);
  // focusItemByIndex(state, nextIndex);
}
export function getItems(root: Node): Element[] {
  const items: Element[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(el: HTMLElement) {
      const owner = el.closest(SELECTOR_FOCUSGROUP) ?? root;
      if (el.inert || owner !== root || el.offsetParent === null)
        return NodeFilter.FILTER_REJECT; // No need to parse children of non-visible, inert, or out-of-scope elements
      if (el.matches(SELECTOR_FOCUSABLE)) return NodeFilter.FILTER_ACCEPT;
      if (el.shadowRoot) items.push(...getItems(el.shadowRoot)); // Also look inside SahdowDOM
      return NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) items.push(walker.currentNode as Element);
  return items;
}

const _getClosestGroup = (el: Element | null, stopAt?: Node) => {
  while (el && el !== stopAt && !el.hasAttribute(ATTR_FOCUSGROUP))
    el =
      el.assignedSlot ||
      el.parentElement ||
      (el.getRootNode() as ShadowRoot)?.host;
  return el || null;
};

// Ensures not enclosed by a out-out-element, see https://open-ui.org/components/scoped-focusgroup.explainer/#opting-out
// Ensures enclosed by same top layer, see https://open-ui.org/components/scoped-focusgroup.explainer/#top-layer-elements
const _getClosestFocusgroup = (el: unknown): Element | null => {
  const group = el instanceof Element && el.closest(SELECTOR_FOCUSGROUP);
  return !group ||
    attr(group, ATTR_FOCUSGROUP) === 'none' ||
    group.closest(SELECTOR_LAYER) !== el.closest(SELECTOR_LAYER)
    ? null
    : group;
};

const _isFocusable = (el: Element): el is HTMLElement => {
  if (!(el instanceof HTMLElement)) return false;
  if ((el as HTMLInputElement).disabled || el.hidden || el.closest('[inert]'))
    return false;
  if (el.offsetParent === null) return false;

  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;

  if (el.matches(SELECTOR_FOCUSABLE)) return true;

  const tabIndex = el.getAttribute('tabindex');
  return tabIndex !== null && parseInt(tabIndex, 10) >= 0;
};

function parseAttribute(owner: Element) {
  const tokens = attr(owner, ATTR_FOCUSGROUP)?.split(' ') || [];
  const behavior = tokens.find(
    (token) => BEHAVIORS[token as keyof typeof BEHAVIORS],
  );
  const base = behavior
    ? BEHAVIORS[behavior as keyof typeof BEHAVIORS]
    : undefined;

  let wrap = base?.wrap ?? false;
  if (tokens.includes('wrap')) wrap = true;
  else if (tokens.includes('nowrap')) wrap = false;

  const hasInline = tokens.includes('inline');
  const hasBlock = tokens.includes('block');
  const axis =
    hasInline === hasBlock
      ? hasInline
        ? undefined
        : base?.axis
      : hasInline
        ? 'inline'
        : 'block';

  return {
    behavior,
    wrap,
    axis,
    memory: !tokens.includes('nomemory'),
  };
}

export function isKeyboardFocusable(element: HTMLElement, owner: Element) {
  return (
    // Is content editable
    (element.isContentEditable ||
      // A media element with controls, this check is necessary because
      // `tabIndex` is `-1` in WebKit in this case
      element.matches(':is(audio, video)[controls]') ||
      // Is tabbable
      element.tabIndex > -1) &&
    !(
      // Not disabled
      (
        (element as HTMLInputElement).disabled ||
        element.hasAttribute('disabled') ||
        // Not an anchor or area without href
        element.matches(':is(a, area):not([href])') ||
        // Not inert
        element.inert ||
        // Not hidden
        !checkVisibility(element, owner) ||
        // Not a media element without controls
        element.matches(':is(audio, video):not([controls])') ||
        // Has not been assigned a tabindex by the polyfill
        element.hasAttribute('DatasetName.AUTHOR_TABINDEX')
      )
    )
  );
}

function checkVisibility(element: Element, ancestor: Element) {
  if ('checkVisibility' in Element.prototype) {
    return element.checkVisibility({
      visibilityProperty: true,
      contentVisibilityAuto: true,
    });
  }

  if (element.getClientRects().length === 0) {
    return false;
  }

  // Walk the ancestry chain checking two properties:
  // - `visibility: hidden/collapse` — hides the element itself, so check from
  //   `element` upward.
  // - `content-visibility: hidden` — hides an element's *content* (descendants,
  //   not itself), so check from `element`'s parent upward.
  let current: Element | null = element;
  while (current) {
    const { visibility, contentVisibility } = window.getComputedStyle(current);
    if (['hidden', 'collapse'].includes(visibility)) {
      return false;
    }
    if (current !== element && contentVisibility === 'hidden') {
      return false;
    }
    if (!ancestor || current === ancestor) {
      break;
    }
    current = getParentElement(current);
  }

  return true;
}

const getParentElement = (el: Element): Element | null =>
  (el as Element).assignedSlot || // Element is slotted — its logical parent is the assigned slot.
  el.parentElement ||
  (el.getRootNode?.() as ShadowRoot).host || // At the top of a shadow tree — cross into the host.
  null;

if (!IS_SUPPORTED)
  onHotReload(ATTR_FOCUSGROUP, () => [
    on(document, 'keydown', handleKeydown),
    on(document, 'focus', handleFocus, QUICK_EVENT),
  ]);
