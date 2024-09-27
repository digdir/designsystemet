import { i } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';

// Utility function to manage a11y attributes
const a11yFieldId = Date.now();
const ARIA_DESC = 'aria-describedby';
const DATA_DESC = 'data-field-description';
const DATA_VALID = 'data-field-validation';
const VOID = () => {};

export const a11yField = (field: HTMLElement | null) => {
  if (!field) return;
  const elements = new Map<Element, ReadonlyArray<[string, string]>>(); // Map of element to [id, attr]
  let desc: Node | null = null;
  let input: Node | null = null;
  let label: HTMLLabelElement | null = null;
  let valid: Node | null = null;

  const handleMutations = (mutations: Partial<MutationRecord>[]) => {
    const added: Node[] = [];
    const removed: Node[] = [];

    for (const { target, addedNodes = [], removedNodes = [] } of mutations) {
      if (target && target !== field) added.push(target);
      else added.push(...addedNodes);
      removed.push(...removedNodes);
    }

    for (const el of added)
      if (el instanceof Element) {
        if (!desc && el.hasAttribute(DATA_DESC)) desc = el;
        if (!input && 'validity' in el) input = el; // Find both native form elements and form-associated custom elements
        if (!label && el instanceof HTMLLabelElement) label = el;
        if (!valid && el.hasAttribute(DATA_VALID)) valid = el;
      }
    console.log({ desc, input, label, valid });
    observer.takeRecords(); // Clear the queue if we done DOM changes in the callback
  };
  const observer = new MutationObserver(handleMutations);

  observer.observe(field, {
    attributeFilter: ['id', ARIA_DESC],
    attributes: true,
    childList: true,
    subtree: true,
  });

  // Trigger initial setup
  handleMutations([{ addedNodes: field.querySelectorAll('*') }]);
  return () => observer.disconnect();
};

const attr = (node: Element, key: string, set?: string) => {
  const val = node.getAttribute(key);
  if (set) node.setAttribute(key, set);
  else node.removeAttribute(key);

  return () => (val ? node.setAttribute(key, val) : node.removeAttribute(key));
};

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
