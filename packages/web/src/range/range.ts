import { getComposedTarget, on, onHotReload, onMutation } from '../utils/utils';

const CSS_VALUE = '--_ds-range-value';
const SELECTOR_RANGE = 'input[type="range"]';

/** Expose value as percentage, so CSS can draw the filled part of the track  */
const setValue = (el: HTMLInputElement) => {
  const min = Number(el.min) || 0;
  const parsedMax = Number(el.max);
  const max =
    el.max.trim() === '' || !Number.isFinite(parsedMax) ? 100 : parsedMax; // Default is 100 when unset or invalid
  const percent =
    max > min ? ((Number(el.value) - min) / (max - min)) * 100 : 0;
  el.style.setProperty(CSS_VALUE, `${percent}%`);
};

const handleInput = (e: Event) => {
  const el = getComposedTarget(e);
  if (el?.matches(SELECTOR_RANGE)) {
    const range = el as HTMLInputElement;
    setValue(range);
    setTimeout(() => {
      if (range.isConnected && range.matches(SELECTOR_RANGE)) setValue(range);
    });
  }
};

/** Form reset updates values after the event, so wait a tick */
const handleReset = (e: Event) => {
  const form = getComposedTarget(e) as HTMLFormElement | null;
  setTimeout(() => {
    for (const el of form?.elements || [])
      if (el.matches(SELECTOR_RANGE)) setValue(el as HTMLInputElement);
  });
};

const handleMutations = (root: Document, records?: MutationRecord[]) => {
  for (const r of records || [null]) {
    const scope = (r?.target as Element) || root;
    if (r?.type === 'attributes') {
      if (scope.matches(SELECTOR_RANGE)) setValue(scope as HTMLInputElement);
    } else if (!r) {
      for (const el of root.querySelectorAll(SELECTOR_RANGE))
        setValue(el as HTMLInputElement);
    } else {
      for (const node of r.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(SELECTOR_RANGE)) setValue(node as HTMLInputElement);
        for (const el of node.querySelectorAll(SELECTOR_RANGE))
          setValue(el as HTMLInputElement);
      }
    }
  }
};

onHotReload('range', () => [
  on(document, 'input', handleInput, true),
  on(document, 'reset', handleReset, true),
  onMutation(document, handleMutations, {
    attributeFilter: ['value', 'min', 'max', 'step', 'type'],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
