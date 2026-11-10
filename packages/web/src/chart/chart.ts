import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  customElements,
  DSElement,
  on,
  onMutation,
  warn,
} from '../utils/utils';

declare global {
  interface HTMLElementTagNameMap {
    'ds-chart': DSChartElement;
  }
}

const ATTR_MAX = 'data-max';
const ATTR_MIN = 'data-min';
const ATTR_STACKED = 'data-stacked';
const ATTR_VALUE = 'data-value';
const ATTR_VARIANT = 'data-variant';
const CSS_AXIS = '--_ds-chart-axis';
const CSS_FROM = '--_ds-chart-from';
const CSS_NEXT = '--_ds-chart-next';
const CSS_SERIES = '--_ds-chart-series';
const CSS_STEPS = '--_ds-chart-steps';
const CSS_TO = '--_ds-chart-to';
const CSS_VALUE = '--_ds-chart-value';
const CSS_ZERO = '--_ds-chart-zero';
const SELECTOR_CONTROL = '[data-chart="variant"]';
const ROLES: Record<string, string> = {
  TABLE: 'table',
  TBODY: 'rowgroup',
  TD: 'cell',
  TFOOT: 'rowgroup',
  THEAD: 'rowgroup',
  TR: 'row',
};

export type DSChartScale = {
  /** Lowest value on the axis */
  min: number;
  /** Highest value on the axis */
  max: number;
  /** Distance between each tick on the axis */
  step: number;
  /** All ticks from max to min */
  ticks: number[];
};

/**
 * chartScale
 * @description Exposes the scale logic if wanting to do custom rendering (i.e. server side or in React/Vue/etc)
 * @param min Lowest value to fit inside scale
 * @param max Highest value to fit inside scale
 * @param count Preferred amount of steps, defaults to 4
 * @return Object with min, max, step and ticks rounded to human friendly numbers
 */
export const chartScale = (min: number, max: number, count = 4) => {
  if (!(max > min)) max = min + 1; // Ensure we always have a range, also when all values are equal or missing
  const rough = (max - min) / Math.max(1, count);
  const pow = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / pow;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
  const from = Math.floor(min / step + 1e-9); // Adding/subtracting epsilon to avoid floating point errors adding a extra step
  const to = Math.ceil(max / step - 1e-9);
  const digits = Math.max(0, -Math.floor(Math.log10(step)));
  const ticks = Array.from({ length: to - from + 1 }, (_, i) =>
    Number(((to - i) * step).toFixed(digits)),
  );

  return { min: from * step, max: to * step, step, ticks } as DSChartScale;
};

export class DSChartElement extends DSElement {
  _unmutate?: () => void; // Using underscore instead of private fields for backwards compatibility
  _unchange?: () => void;

  static get observedAttributes() {
    return [ATTR_MAX, ATTR_MIN, ATTR_STACKED, ATTR_VARIANT]; // Using ES2015 syntax for backwards compatibility
  }
  connectedCallback() {
    this._unchange = on(this, 'change', handleChange);
    this._unmutate = onMutation(this, render, {
      attributeFilter: [ATTR_VALUE], // Only observe attributes we do not write our selves to prevent infinite loops
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
  attributeChangedCallback() {
    if (this._unmutate) render(this); // Ensure we do not run any renders before connectedCallback
  }
  disconnectedCallback() {
    this._unchange?.();
    this._unmutate?.();
    this._unchange = this._unmutate = undefined;
  }
}

// Allow any radio or select inside the chart to switch variant, i.e. between chart and table
const handleChange = (event: Event) => {
  const self = event.currentTarget as DSChartElement;
  const control = event.target as HTMLInputElement | HTMLSelectElement | null;

  // Attribute can be on the control itself, or on a parent such as a <fieldset> of radios
  if (control?.closest?.(SELECTOR_CONTROL) && control.value)
    attr(self, ATTR_VARIANT, control.value);
};

const render = (self: DSChartElement) => {
  const table = self.querySelector('table');
  if (!table) return; // Do not warn about missing table as virtual DOM libraries might give false positives

  const rows = Array.from(table.querySelectorAll(':scope > tbody > tr')); // Using querySelectorAll over table.tBodies for best test environment support
  const cells = rows.map((row) => Array.from(row.children).filter(isData));
  const values = cells.map((row) => row.map(getNumberParser(self)));
  const isLine = attr(self, ATTR_VARIANT) === 'line';
  const isStacked =
    !isLine && (attr(self, ATTR_STACKED) ?? 'false') !== 'false';

  // Find the extremes, where stacked charts needs the sum of each row
  let hi = 0; // Always include 0 as charts not starting at zero are easily misread
  let lo = 0;
  for (const row of values) {
    const valid = row.filter(isValid);
    const pos = valid.filter((value) => value > 0);
    const neg = valid.filter((value) => value < 0);
    hi = Math.max(hi, isStacked ? sum(pos) : Math.max(0, ...pos));
    lo = Math.min(lo, isStacked ? sum(neg) : Math.min(0, ...neg));
  }

  const { min, max, ticks } = chartScale(
    getNumber(self, ATTR_MIN, lo),
    getNumber(self, ATTR_MAX, hi),
  );
  const format = getNumberFormat(self, ticks);
  const scale = (value: number) =>
    `${Math.round(((value - min) / (max - min)) * 1e4) / 1e4}`; // Round to avoid long decimals in DOM

  // Using CSS strings so axis can be rendered without changing the DOM, "\a" is new line in CSS
  setStyle(self, CSS_AXIS, `"${ticks.map(format).join('\\a ')}"`);
  setStyle(self, CSS_STEPS, `${ticks.length - 1}`);
  setStyle(self, CSS_SERIES, `${Math.max(1, ...cells.map((c) => c.length))}`);
  setStyle(self, CSS_ZERO, scale(Math.min(max, Math.max(min, 0))));

  cells.forEach((row, rowIndex) => {
    let pos = 0;
    let neg = 0;
    row.forEach((cell, index) => {
      const value = values[rowIndex][index];
      const next = values[rowIndex + 1]?.[index];
      const base = isStacked ? (value > 0 ? pos : neg) : 0;
      const ok = isValid(value);

      if (ok && value > 0) pos += value;
      if (ok && value < 0) neg += value;
      setStyle(cell, CSS_VALUE, ok ? scale(value) : null);
      setStyle(cell, CSS_FROM, ok ? scale(Math.min(base, base + value)) : null);
      setStyle(cell, CSS_TO, ok ? scale(Math.max(base, base + value)) : null);
      setStyle(cell, CSS_NEXT, ok && isValid(next) ? scale(next) : null);
    });
  });

  // Ensure table semantics are kept when CSS changes display, as some browser and
  // screen reader combinations drop semantics of tables not having display: table
  for (const el of [table, ...table.querySelectorAll('*')]) {
    const isTh = el.nodeName === 'TH';
    const isCol = attr(el, 'scope')?.startsWith('col') || el.closest('thead');
    const role = isTh
      ? `${isCol ? 'column' : 'row'}header`
      : ROLES[el.nodeName];
    if (role && !attr(el, 'role') && el.closest('table') === table)
      attr(el, 'role', role);
  }

  const isNamed = attr(table, ARIA_LABEL) || attr(table, ARIA_LABELLEDBY);
  if (!isNamed && !table.querySelector(':scope > caption'))
    warn(`Missing <caption>, ${ARIA_LABEL} or ${ARIA_LABELLEDBY} on:`, table);
};

const isData = (cell: Element): cell is HTMLTableCellElement =>
  cell.nodeName === 'TD';
const isValid = (value?: number): value is number => Number.isFinite(value);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

const getNumber = (el: Element, name: string, fallback: number) => {
  const value = Number.parseFloat(attr(el, name) || '');
  return isValid(value) ? value : fallback;
};

const getLocale = (el: Element) => {
  const lang = el.closest('[lang]')?.getAttribute('lang') || undefined;
  try {
    return Intl.NumberFormat.supportedLocalesOf(lang || [])[0];
  } catch (_) {} // Fall back to browser locale if lang attribute is not a valid language tag
};

const getNumberFormat = (el: Element, ticks: number[]) => {
  const digits = ticks.map((tick) => `${tick}`.split('.')[1]?.length || 0);
  const { format } = new Intl.NumberFormat(getLocale(el), {
    maximumFractionDigits: 20,
    minimumFractionDigits: Math.min(20, Math.max(...digits)), // Same amount of decimals for all ticks
  });
  return format;
};

// Parse formatted numbers such as "1 234,5 kr" or "1,234.5" based on language of the element
const getNumberParser = (el: Element) => {
  const parts = new Intl.NumberFormat(getLocale(el)).formatToParts(-12345.6);
  const group = parts.find(({ type }) => type === 'group')?.value || '';
  const decimal = parts.find(({ type }) => type === 'decimal')?.value || '.';

  return (cell: Element) => {
    const value = attr(cell, ATTR_VALUE);
    if (value !== null) return Number.parseFloat(value); // data-value is always a machine readable number
    const text = (cell.textContent || '')
      .replace(/\s/g, '') // Also matches non-breaking spaces
      .split(group.trim() || ' ') // Group is trimmed as whitespace groups are already removed
      .join('')
      .replace(decimal, '.')
      .replace(/[−‒–]/g, '-'); // Minus sign, figure dash and en dash

    return Number.parseFloat(text.match(/-?\d+(\.\d+)?/)?.[0] || '');
  };
};

// Setting CSS properties individually to prevent issues with CSP
const setStyle = (el: HTMLElement, name: string, value: string | null) => {
  if (value === null) el.style.removeProperty(name);
  else if (el.style.getPropertyValue(name) !== value)
    el.style.setProperty(name, value);
};

customElements.define('ds-chart', DSChartElement);
