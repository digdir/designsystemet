import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  attrOrCSS,
  onHotReload,
  onMutation,
  warn,
} from '../utils/utils';

const ATTR_TOGGLEGROUP = 'data-toggle-group';
const SELECTOR_TOGGLEGROUP = `[${ATTR_TOGGLEGROUP}]`;

const handleMutations = (root: Document, records?: MutationRecord[]) => {
  for (const r of records || [null]) {
    if (r?.attributeName === ATTR_TOGGLEGROUP) deprecate(r.target as Element);
    else if (!r || r.addedNodes.length) {
      const scope = (r?.target as Element) || root;
      for (const el of scope.querySelectorAll(SELECTOR_TOGGLEGROUP))
        deprecate(el);
    }
  }
};

const deprecate = (el: Element) => {
  const label = attrOrCSS(el, ATTR_TOGGLEGROUP);
  const labelledby = attr(el, ARIA_LABELLEDBY)?.trim();
  const message = `Please use focusgroup="radiogroup" and ${labelledby ? ARIA_LABELLEDBY : ARIA_LABEL}="${labelledby || label}" instead of deprecated ${ATTR_TOGGLEGROUP} on:`;

  attr(el, ARIA_LABEL, labelledby ? null : label);
  attr(el, 'focusgroup', 'radiogroup');
  warn(message, el);
};

onHotReload('toggle-group', () => [
  onMutation(document, handleMutations, {
    attributeFilter: [ATTR_TOGGLEGROUP],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
