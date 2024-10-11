const ARIA_DESC = "aria-describedby";

/**
 * The cache takes a element identifier as key, and a object of element, attribute, and original value.
 * If there is no original value, we create a fallback value, but do not store it.
 */
type Cache = Record<string, Entry>;
type Entry = {
  el: Element | null;
  attr: string;
  value: string | null;
  prefix?: string;
};

export const fieldA11Y = (field: HTMLElement | null) => {
  if (!field) return;

  const elements = field.getElementsByTagName("*"); // Speed up by using a live HTMLCollection instead of traversing MutationRecords
  const uuid = `:${Math.round(Date.now() + Math.random() * 100).toString(36)}`;
  const cache: Cache = {
    input: { el: null, attr: "id", value: null },
    label: { el: null, attr: "for", value: null },
    help: { el: null, attr: "id", value: null, prefix: "help" },
    valid: { el: null, attr: "id", value: null, prefix: "valid" },
  };

  const observer = createOptimizedMutationObserver(() => {
    // Find elements
    for (const el of elements) {
      if (el instanceof HTMLLabelElement) update(cache, "label", el);
      else if ("validity" in el) update(cache, "input", el);
      else if (el.hasAttribute("data-field-help")) update(cache, "help", el);
      else if (el.hasAttribute("data-field-validation"))
        update(cache, "valid", el);
    }

    // Set attributes or reset if no input or moved outside field
    const input = cache.input.el;
    const inputId = input && (cache.input.value || uuid);
    for (const [key, { el, attr, value, prefix }] of Object.entries(cache)) {
      if (!inputId || !field.contains(el)) reset(cache, key);
      else el?.setAttribute(attr, value || `${prefix || ""}${inputId}`);
    }

    // Set aria-description, and make order is: validation, help, ...rest
    const descs =
      `${cache.valid.prefix}${inputId} ${cache.help.prefix}${inputId} ${input?.getAttribute(ARIA_DESC) || ""}`
        .split(" ")
        .filter((id, idx, all) => id && all.indexOf(id) === idx) // Remove empty and duplicates
        .join(" ");

    if (descs) input?.setAttribute(ARIA_DESC, descs);
    else input?.removeAttribute(ARIA_DESC);
  });

  observer.observe(field, {
    attributeFilter: ["id", ARIA_DESC],
    attributes: true,
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
};

const update = (cache: Cache, key: string, el: Element) => {
  if (cache[key].el === el) return; // TODO: What about storing reset if original attribute changes?
  reset(cache, key);
  cache[key].el = el;
  cache[key].value = el.getAttribute(cache[key].attr);
};

const reset = (cache: Cache, key: string) => {
  const { el, attr, value } = cache[key] || {};
  value ? el?.setAttribute(attr, value) : el?.removeAttribute(attr);
  cache[key].el = cache[key].value = null;
};

// Speed up MutationObserver by debouncing and only running when page is visible
const createOptimizedMutationObserver = (callback: () => void) => {
  let queue: ReturnType<typeof requestAnimationFrame> = 0;
  const observer = new MutationObserver(() => {
    if (!queue) queue = requestAnimationFrame(process);
  });

  const process = () => {
    callback();
    queue = 0; // Empty queue
    observer.takeRecords(); // Clear queue of our DOM changes
  };

  requestAnimationFrame(process); // Initial setup
  return observer;
};

/*
const ELEMENTS = [
  ['input', 'id', (node: Node) => 'validity' in node], // Muse be first
  ['label', 'for', (node: Node) => node instanceof HTMLLabelElement],
  ['desc', 'id', (node: Node) => hasAttr(node, 'data-field-description')],
  ['valid', 'id', (node: Node) => hasAttr(node, 'data-field-validation')],
] as const;

const hasAttr = (node: Node, attr: string) =>
  node instanceof Element && node.hasAttribute(attr);

export const a11yField = (field: HTMLElement | null) => {
  if (!field) return;
  let input: Element | undefined;
  const attrs: Record<string, string> = {}; // Map of element to [id, attr]
  const handleMutation = (mutations: Partial<MutationRecord>[]) => {
    const changedNodes: Node[] = [];

    // Collect all changed nodes from MutationRecords
    for (const { target, addedNodes = [], removedNodes = [] } of mutations)
      changedNodes.push(target ?? field, ...addedNodes, ...removedNodes);

    // Run through changedNode for each ELEMENTS check
    for (const [key, attr, check] of ELEMENTS)
      for (const el of changedNodes)
        if (el instanceof Element && check(el)) {
          const isInput = key === 'input';
          const value = el.getAttribute(attr);
          const fallback = `${attrs.input ?? (++a11yFieldId).toString(32)}${isInput || attr !== 'id' ? '' : `:${key}`}`;
          attrs[key] = value || fallback; // Store attribute value

          if (isInput) input = el.parentNode ? el : undefined; // Update connected input
          if (el.parentNode) value || el.setAttribute(attr, fallback);
          else if (value === fallback) el.removeAttribute(attr); // Reset attribute if removed
        }

    // Set aria-description, and make order is: validation, description, ...rest
    const descs =
      `${attrs.valid || ''} ${attrs.desc || ''} ${input?.getAttribute(ARIA_DESC) || ''}`
        .split(' ')
        .filter((id, idx, all) => id && all.indexOf(id) === idx) // Remove empty and duplicates
        .join(' ');

    if (descs) input?.setAttribute(ARIA_DESC, descs);
    else input?.removeAttribute(ARIA_DESC);

    observer.takeRecords(); // Clear queue of our DOM changes
  };

  let debounce: ReturnType<typeof setTimeout> | undefined;
  const handleMutationDebounced = (mutations: Partial<MutationRecord>[]) => {
    clearTimeout(debounce);
    debounce = setTimeout(handleMutation, 100, mutations);
  };

  const observer = new MutationObserver(handleMutationDebounced);
  observer.observe(field, {
    attributeFilter: ['id', ARIA_DESC],
    attributes: true,
    childList: true,
    subtree: true,
  });

  handleMutationDebounced([{ addedNodes: field.querySelectorAll('*') }]); // Initial setup
  return () => observer.disconnect();
};*/

// const attr = (node: Element, key: string, set?: string) => {
//   const val = node.getAttribute(key);
//   if (set) node.setAttribute(key, set);
//   else node.removeAttribute(key);

//   return () => (val ? node.setAttribute(key, val) : node.removeAttribute(key));
// };

// for (const el of removed) {
//   const attrs = elements.get(el);
//   if (attrs) {
//     el.setAttribute(attrs[0], attrs[1]);
//     elements.delete(el);
//   }
// }

// desc = added.find((el) => el.hasAttribute(DATA_DESC)) || desc;
// input = added.find((el) => 'validity' in el) || input; // Find both native form elements and form-associated custom elements
// label = added.find((el) => el instanceof HTMLLabelElement) || label;
// valid = added.find((el) => el.hasAttribute(DATA_VALID)) || valid;

// const inputId = input?.id || (++a11yFieldId).toString(32); // Must run first

// for (const el of added)
//   if (el instanceof Element) {
//     if (!desc && el.hasAttribute(DATA_DESC)) desc = el;
//     if (!input && 'validity' in el) input = el; // Find both native form elements and form-associated custom elements
//     if (!label && el instanceof HTMLLabelElement) label = el;
//     if (!valid && el.hasAttribute(DATA_VALID)) valid = el;
//   }

// const [prevEl, prevValue] = elements[key] || [];
// const nowValue = el.getAttribute(attr);

// if (prevEl) {
//   if (prevValue) prevEl.setAttribute(attr, prevValue);
//   else prevEl.removeAttribute(attr);
// }
// if (el.parentNode) {
//   elements[key] = [el, nowValue];
//   el;
// }

// const desc = field?.querySelector('[data-field-description]');
// const label = field?.querySelector('label');
// const valid = field?.querySelector('[data-field-validation]');
// const input = Array.from(field?.querySelectorAll('*') || []).find(
//   (el) => 'validity' in el, // Find both native form elements and form-associated custom elements
// );

// if (input && !input.id) input.id = (++a11yFieldId).toString(32); // Must run first
// if (desc && !desc.id) desc.id = `${input?.id}:desc`;
// if (label && !label.htmlFor) label.htmlFor = input?.id || '';
// if (valid && !valid.id) valid.id = `${input?.id}:valid`;

// // Set aria-description, and make order is: validation, description, ...rest
// const descs =
//   `${valid?.id || ''} ${desc?.id || ''} ${input?.getAttribute(ARIA_DESC)?.trim() || ''}`
//     .split(' ')
//     .filter((id, index) => (index < 2 ? id : !id.startsWith(input?.id || '')))
//     .join(' ');

// if (descs) input?.setAttribute(ARIA_DESC, descs);
// else input?.removeAttribute(ARIA_DESC);
