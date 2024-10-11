export const fieldA11Y = (fieldElement: HTMLElement | null) => {
  if (!fieldElement) return;

  const uuid = `:${Math.round(Date.now() + Math.random() * 100).toString(36)}`;
  const elements = fieldElement.getElementsByTagName("*"); // Speed up by using a live HTMLCollection instead of traversing MutationRecords
  const connected = new Set<Element>();
  let input: Element | null = null;

  const observer = createOptimizedMutationObserver(() => {
    // Find elements
    for (const el of elements) {
      if ("validity" in el) input = el;
      else if (el instanceof HTMLLabelElement || el.hasAttribute("data-field"))
        connected.add(el);
    }

    // Setup attributes
    const describedby: string[] = [];
    if (!fieldElement.contains(input)) input = null; // Reset if input is removed
    if (input && !input.id) input.id = uuid; // Ensure input always has ID
    for (const el of connected) {
      if (!input || !fieldElement.contains(el)) {
        connected.delete(el);
        el.removeAttribute("for");
        el.removeAttribute("id");
      } else if (el instanceof HTMLLabelElement) el.htmlFor = input.id;
      else {
        el.id = `${input.id}:${el.getAttribute("data-field")}`;
        describedby[el.hasAttribute("data-error") ? "unshift" : "push"](el.id); // Errors to the front
      }
    }

    // Set aria-describedby
    if (!describedby.length) input?.removeAttribute("aria-describedby");
    else input?.setAttribute("aria-describedby", describedby.join(" "));
  });

  observer.observe(fieldElement, {
    attributeFilter: ["id", "for", "aria-describedby"],
    attributes: true,
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
};

// Speed up MutationObserver by debouncing, clearing internal queue after changes and only running when page is visible
const createOptimizedMutationObserver = (callback: () => void) => {
  let queue: ReturnType<typeof requestAnimationFrame> = 0;
  const observer = new MutationObserver(() => {
    cancelAnimationFrame(queue);
    queue = requestAnimationFrame(process);
  });

  const process = () => {
    callback();
    observer.takeRecords(); // Clear queue due to DOM changes in callback
  };

  requestAnimationFrame(process); // Initial setup
  return observer;
};
