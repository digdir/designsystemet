import {
  ARIA_LABELLEDBY,
  attr,
  isBrowser,
  onHotReload,
  onMutation,
  useId,
} from '../utils/utils';

const FIELDSETS = isBrowser() ? document.getElementsByTagName('fieldset') : [];

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
    if (fieldset.hasAttribute(ARIA_LABELLEDBY)) continue; // Speed up by skipping labelled fieldsets

    let labelledby = '';
    for (const el of fieldset.children) {
      const name = el.nodeName;
      const isLegendOrDescription =
        name === 'LEGEND' ||
        el.getAttribute('data-field') === 'description' ||
        (name === 'P' && el.previousElementSibling?.nodeName === 'LEGEND'); // Backwards compatibility

      if (isLegendOrDescription) labelledby += `${useId(el)} `;
    }
    attr(fieldset, ARIA_LABELLEDBY, labelledby.trim() || null);
  }
};

onHotReload('fieldset', () => [
  onMutation(document, handleFieldsetMutations, {
    childList: true,
    subtree: true,
  }),
]);
