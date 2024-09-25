// Utility function to manage a11y attributes
let a11yFieldId = Date.now();
const ARIA_DESC = 'aria-describedby';

export const a11yField = (field: HTMLElement | null) => {
  const desc = field?.querySelector('[data-field-help]');
  const label = field?.querySelector('label');
  const valid = field?.querySelector('[data-field-validation]');
  const input = Array.from(field?.querySelectorAll('*') || []).find(
    (el) => 'validity' in el, // Find both native form elements and form-associated custom elements
  );

  if (input && !input.id) input.id = (++a11yFieldId).toString(32); // Must run first
  if (desc && !desc.id) desc.id = `${input?.id}:desc`;
  if (label && !label.htmlFor) label.htmlFor = input?.id || '';
  if (valid && !valid.id) valid.id = `${input?.id}:valid`;

  // Set aria-description, and make order is: validation, description, ...rest
  const descs =
    `${valid?.id || ''} ${desc?.id || ''} ${input?.getAttribute(ARIA_DESC)?.trim() || ''}`
      .split(' ')
      .filter((id, index) => (index < 2 ? id : !id.startsWith(input?.id || '')))
      .join(' ');

  if (descs) input?.setAttribute(ARIA_DESC, descs);
  else input?.removeAttribute(ARIA_DESC);
};
