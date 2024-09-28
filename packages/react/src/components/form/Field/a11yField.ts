// Utility function to manage a11y attributes
let a11yFieldId = Date.now();
const ARIA_DESC = 'aria-describedby';
const ELEMENTS = [
  ['input', 'id', (el: Element) => 'validity' in el], // Muse be first
  ['label', 'for', (el: Element) => el instanceof HTMLLabelElement],
  ['desc', 'id', (el: Element) => el.hasAttribute('data-field-description')],
  ['valid', 'id', (el: Element) => el.hasAttribute('data-field-validation')],
] as const;

export const a11yField = (field: HTMLElement | null) => {
  if (!field) return;
  const elements: Record<string, string> = {}; // Map of element to [id, attr]

  const handleMutations = (mutations: Partial<MutationRecord>[]) => {
    let input: Element | undefined;
    const changed: Node[] = [];

    for (const { target, addedNodes = [], removedNodes = [] } of mutations)
      changed.push(target ?? field, ...addedNodes, ...removedNodes);

    for (const [key, attr, check] of ELEMENTS)
      for (const el of changed)
        if (el instanceof Element && check(el)) {
          const reset = elements[key];
          const prev = el.getAttribute(attr);
          const next = `${input?.id ?? (++a11yFieldId).toString(32)}${key !== 'input' && attr === 'id' ? `:${key}` : ''}`;

          if (key === 'input') input = el;
          if (!prev) el.setAttribute(attr, next);
          elements[key] = prev || next;
        }

    const descs = [
      elements.valid,
      elements.desc,
      input?.getAttribute(ARIA_DESC),
    ];
    console.log(descs);

    observer.takeRecords(); // Clear the queue if we done DOM changes in the callback
  };
  const observer = new MutationObserver(handleMutations);

  observer.observe(field, {
    attributeFilter: ['id', ARIA_DESC],
    attributes: true,
    childList: true,
    subtree: true,
  });

  handleMutations([{ addedNodes: field.querySelectorAll('*') }]); // Initial setup
  return () => observer.disconnect();
};

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
