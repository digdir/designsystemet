import {
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
  for (const el of FIELDSETS) {
    if (el.hasAttribute('aria-labelledby')) continue; // Speed up by skipping labelled fieldsets
    const labelledby = `${useId(el.querySelector('legend'))} ${useId(el.querySelector(':scope > :is([data-field="description"],legend + p)'))}`;
    attr(el, 'aria-labelledby', labelledby.trim() || null);
  }
};

onHotReload('fieldset', () => [
  onMutation(document, handleFieldsetMutations, {
    childList: true,
    subtree: true,
  }),
]);
