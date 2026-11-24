import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  isBrowser,
  onHotReload,
  onMutation,
  useId,
} from '../utils/utils';

const ATTR_FIELD = 'data-field';
const FIELDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];
const MANAGED = new WeakMap<Element, string>(); // Keep track of aria-labelledby values we have set, so we never overwrite values set by consumer

// NOTE:
// <fieldset> descriptions should be accessible to screen reader users. However, using aria-describedby
// on <fieldset> causes all child <input> elements to inherit the same description, resulting in redundant and confusing announcements.
// To avoid this, we use aria-labelledby to reference both the legend and the description.
// aria-labelledby is only announced when screen readers enter the fieldset, not when navigating its child elements.
// This means the accessible name of <fieldset> includes both the legend and description, which may differ from some test expectations,
// but as of March 2026, this approach provides the best user experience across assistive technologies.
// This approach is also verified by the chief of accessibility at NRK and the accessibility expert at NAV
const handleFieldsetMutations = () => {
  for (const fieldset of FIELDSETS) {
    const prev = attr(fieldset, ARIA_LABELLEDBY);
    if (prev && prev !== MANAGED.get(fieldset)) continue; // Skip if aria-labelledby is set by consumer

    // aria-labelledby overrules aria-label, so only look for elements when consumer has not provided aria-label
    const els = [];
    let legend: Element | undefined;
    if (!attr(fieldset, ARIA_LABEL)?.trim())
      for (const el of fieldset.children) {
        if (el.nodeName === 'LEGEND') legend ??= el;
        else if (attr(el, ATTR_FIELD) === 'description') els.push(el);
      }

    if (legend && els.length) els.unshift(legend); // Only name the fieldset when it has a description
    const next = els.map(useId).join(' ');
    attr(fieldset, ARIA_LABELLEDBY, next || null);
    if (next) MANAGED.set(fieldset, next);
    else MANAGED.delete(fieldset);
  }
};

onHotReload('fieldset', () => [
  onMutation(document, handleFieldsetMutations, {
    attributeFilter: [ATTR_FIELD], // Needed to stay in sync when aria-label or description changes
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
