export const fieldA11Y = (fieldElement: HTMLElement | null) => {
  if (!fieldElement) return;

  const elements = new Map<Element, string | null>();
  const uuid = `:${Math.round(Date.now() + Math.random() * 100).toString(36)}`;
  let input: Element | null = null;

  const process = (mutations: Partial<MutationRecord>[]) => {
    const changed: Node[] = [];
    const removed: Node[] = [];

    // Merge MutationRecords
    for (const mutation of mutations) {
      if (mutation.attributeName) changed.push(mutation.target ?? fieldElement);
      changed.push(...(mutation.addedNodes || []));
      removed.push(...(mutation.removedNodes || []));
    }

    // Register elements
    for (const el of changed)
      if (isElement(el)) {
        if (isLabel(el)) elements.set(el, el.htmlFor);
        else if ("validity" in el) input = el;
        else if (el.hasAttribute("data-field")) elements.set(el, el.id);
      }

    // Reset removed elements
    for (const el of removed)
      if (isElement(el) && elements.has(el)) {
        const attr = isLabel(el) ? "for" : "id";
        setAttr(el, attr, elements.get(el));
        elements.delete(el);
      }

    // Connect elements
    const inputId = input?.id || uuid;
    const describedby: string[] = [];
    for (const [el, value] of elements) {
      const attr = isLabel(el) ? "for" : "id";
      const type = el.getAttribute("data-field");

      if (!value) setAttr(el, attr, type ? `${inputId}:${type}` : inputId); // Ensure we have a value
      if (type) describedby[type === "validation" ? "unshift" : "push"](el.id); // Validations to the front
    }

    // Set aria-describedby
    setAttr(input, "id", inputId);
    setAttr(input, "aria-describedby", describedby.join(" "));
  };

  const observer = createOptimizedMutationObserver(process);
  observer.observe(fieldElement, {
    attributeFilter: ["id", "for", "aria-describedby"],
    attributes: true,
    childList: true,
    subtree: true,
  });

  process([{ addedNodes: fieldElement.querySelectorAll("*") }]); // Initial setup
  observer.takeRecords(); // Clear initial setup queue
  return () => observer.disconnect();
};

// Utilities
const isElement = (node: Node) => node instanceof Element;
const isLabel = (node: Node) => node instanceof HTMLLabelElement;
const setAttr = (el: Element | null, name: string, value?: string | null) =>
  value ? el?.setAttribute(name, value) : el?.removeAttribute(name);

// Speed up MutationObserver by debouncing, clearing internal queue after changes and only running when page is visible
const createOptimizedMutationObserver = (callback: MutationCallback) => {
  const queue: MutationRecord[] = [];
  const observer = new MutationObserver((mutations) => {
    if (!queue.length) requestAnimationFrame(process);
    queue.push(...mutations);
  });

  const process = () => {
    callback(queue, observer);
    queue.length = 0; // Reset queue
    observer.takeRecords(); // Clear queue due to DOM changes in callback
  };

  return observer;
};
