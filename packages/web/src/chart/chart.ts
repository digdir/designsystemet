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
const CSS_CHARS = '--_ds-chart-chars';
const CSS_FROM = '--_ds-chart-from';
const CSS_MAX_CHARS = '--_ds-chart-max-chars';
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
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max) || !(max - min > 0))
    max = min + (Math.abs(min) || 1); // Ensure we always have a range, also when all values are equal or missing
  const steps = Math.min(20, Math.max(1, Math.round(count) || 4));
  const rough = (max - min) / steps;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / pow;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * pow;
  const from = Math.floor(min / step + 1e-9); // Adding/subtracting epsilon to avoid floating point errors adding a extra step
  const to = Math.ceil(max / step - 1e-9);
  const digits = Math.min(100, Math.max(0, -Math.floor(Math.log10(step)))); // toFixed supports 0-100 digits
  const length = Math.min(100, Math.max(2, to - from + 1)) || 2; // Never create huge amounts of ticks if range is extremely far from zero
  const ticks = Array.from(
    { length },
    (_, i) => Number(((to - i) * step).toFixed(digits)) + 0, // Adding 0 to avoid negative zero
  );

  // Using ticks for min and max to avoid floating point errors such as 0.30000000000000004
  return { min: ticks[length - 1], max: ticks[0], step, ticks } as DSChartScale;
};

export class DSChartElement extends DSElement {
  _unmutate?: () => void; // Using underscore instead of private fields for backwards compatibility
  _unchange?: () => void;

  static get observedAttributes() {
    return [ATTR_MAX, ATTR_MIN, ATTR_STACKED, ATTR_VARIANT, 'lang']; // Using ES2015 syntax for backwards compatibility
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

// Allow radios and selects inside the chart to switch variant, i.e. between chart and table
const handleChange = (event: Event) => {
  const self = event.currentTarget as DSChartElement;
  const control = event.target as HTMLInputElement | HTMLSelectElement | null;
  const isRadio =
    control instanceof HTMLInputElement && control.type === 'radio';
  const isSelect = control instanceof HTMLSelectElement && !control.multiple;

  if (!control || !(isSelect || (isRadio && control.checked))) return;
  if (control.closest('ds-chart') !== self) return; // Skip controls belonging to a nested chart

  // Attribute can be on the control itself, or on a parent such as a <fieldset> of radios
  const match = control.closest(SELECTOR_CONTROL);
  const value = isRadio ? attr(control, 'value') : control.value; // Skip default "on" value of radios without value attribute
  if (match && self.contains(match)) attr(self, ATTR_VARIANT, value || null);
};

const render = (self: DSChartElement) => {
  const table = self.querySelector<HTMLTableElement>(':scope > table');
  if (!table) return; // Do not warn about missing table as virtual DOM libraries might give false positives

  const parse = getNumberParser(self);
  const rows = Array.from(
    table.querySelectorAll(':scope > tbody > tr'), // Using querySelectorAll over table.tBodies for best test environment support
  );
  const cells = rows.map((row) => Array.from(row.children).filter(isData));
  const values = cells.map((row) => row.map(parse));
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

  // data-min and data-max can only extend the axis, as values outside the axis would be drawn outside the chart
  const { min, max, ticks } = chartScale(
    Math.min(lo, getNumber(self, ATTR_MIN, lo)),
    Math.max(hi, getNumber(self, ATTR_MAX, hi)),
  );
  const format = getNumberFormat(self, ticks);
  const scale = (value: number) =>
    `${Math.round(((value - min) / (max - min)) * 1e4) / 1e4}`; // Round to avoid long decimals in DOM

  // Using CSS strings so axis can be rendered without changing the DOM, "\a" is new line in CSS
  setStyle(self, CSS_AXIS, `"${ticks.map(format).join('\\a ')}"`);
  setStyle(self, CSS_STEPS, `${ticks.length - 1}`);
  setStyle(self, CSS_SERIES, `${Math.max(1, ...cells.map((c) => c.length))}`);
  setStyle(self, CSS_ZERO, scale(Math.min(max, Math.max(min, 0))));

  let maxChars = 1;

  cells.forEach((row, rowIndex) => {
    const isSameBody =
      rows[rowIndex].parentNode === rows[rowIndex + 1]?.parentNode; // Lines are never drawn between <tbody> elements
    let pos = 0;
    let neg = 0;
    row.forEach((cell, index) => {
      const value = values[rowIndex][index];
      const next = isSameBody ? values[rowIndex + 1][index] : Number.NaN;
      const base = isStacked ? (value < 0 ? neg : pos) : 0;
      const ok = isValid(value);

      if (ok && value > 0) pos += value;
      if (ok && value < 0) neg += value;
      const chars = cell.textContent?.trim().length || 0; // Lets CSS know how much room the value needs

      maxChars = Math.max(maxChars, chars);
      setStyle(cell, CSS_CHARS, `${chars}`);
      setStyle(cell, CSS_VALUE, ok ? scale(value) : null);
      setStyle(cell, CSS_FROM, ok ? scale(Math.min(base, base + value)) : null);
      setStyle(cell, CSS_TO, ok ? scale(Math.max(base, base + value)) : null);
      setStyle(cell, CSS_NEXT, ok && isValid(next) ? scale(next) : null);
    });
  });

  setStyle(self, CSS_MAX_CHARS, `${maxChars}`);

  // Ensure table semantics are kept when CSS changes display, as some browser and
  // screen reader combinations drop semantics of tables not having display: table
  for (const el of [table, ...table.querySelectorAll('*')]) {
    const isTh = el.nodeName === 'TH';
    if ((!isTh && !ROLES[el.nodeName]) || attr(el, 'role')) continue; // Skip if not relevant, or if role is already set
    if (el.closest('table') !== table) continue; // Skip nested tables

    const scope = attr(el, 'scope')?.toLowerCase() || '';
    const isHeaderRow =
      el.closest('thead') || !el.parentElement?.querySelector(':scope > td'); // Rows with only <th> are headers for columns
    const isCol = scope ? scope.startsWith('col') : isHeaderRow;
    attr(
      el,
      'role',
      isTh ? `${isCol ? 'column' : 'row'}header` : ROLES[el.nodeName],
    );
  }

  // Only warn once per table, as render runs on every change
  if (WARNED.has(table) || !rows.length) return;
  const isNamed = attr(table, ARIA_LABEL) || attr(table, ARIA_LABELLEDBY);
  const isMissingHeaders =
    !table.querySelector(':scope > thead') ||
    rows.some((row) => !row.querySelector(':scope > th'));

  if (!isNamed && !table.querySelector(':scope > caption'))
    warn(`Missing <caption>, ${ARIA_LABEL} or ${ARIA_LABELLEDBY} on:`, table);
  if (isMissingHeaders)
    warn(
      'Missing <thead>, or <th scope="row"> as first cell in rows of:',
      table,
    );
  WARNED.add(table);
};

const WARNED = new WeakSet<Element>();
const FALLBACK_LOCALE = 'nb'; // Never falling back to browser locale, as same HTML would then draw different charts for different users
const NORWEGIAN = /^(nn|no|se|smj|sma|fkv)\b/i; // Languages used in Norway that are not supported by Intl in all browsers
const SKIP_TEXT = 'sup,sub,[hidden],[aria-hidden="true"]'; // Footnotes and hidden content is not part of the number
const NUMBER = /[.,]?\d(?:[\d.,]|[\s'’](?=\d{3}(?!\d)))*/; // Digits with separators, where whitespace and apostrophes only are allowed in front of groups of three digits
const MINUS = /[‐-–−]/g; // Hyphen, non-breaking hyphen, figure dash, en dash and minus sign

const isData = (cell: Element): cell is HTMLTableCellElement =>
  cell.nodeName === 'TD';
const isValid = (value?: number): value is number => Number.isFinite(value);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

// Attributes are always machine readable numbers, and empty attributes are ignored
const getNumber = (el: Element, name: string, fallback = Number.NaN) => {
  const value = attr(el, name)?.trim();
  return value && isValid(Number(value)) ? Number(value) : fallback;
};

const getLocale = (el: Element) => {
  let lang = '';
  for (let node: Element | null = el; node && !lang; ) {
    lang = attr(node.closest('[lang]') || node, 'lang')?.trim() || '';
    node = (node.getRootNode?.() as ShadowRoot)?.host || null; // Continue looking outside shadow root
  }
  try {
    lang = lang.replace(/_/g, '-').replace(NORWEGIAN, FALLBACK_LOCALE);
    return Intl.NumberFormat.supportedLocalesOf(lang)[0] || FALLBACK_LOCALE;
  } catch (_) {
    return FALLBACK_LOCALE; // If lang attribute is not a valid language tag
  }
};

const getNumberFormat = (el: Element, ticks: number[]) => {
  const digits = ticks.map((tick) => tick.toFixed(20).replace(/\.?0+$/, '')); // Using toFixed to avoid exponent notation of small numbers
  const decimals = digits.map((tick) => tick.split('.')[1]?.length || 0);
  const { format } = new Intl.NumberFormat(getLocale(el), {
    maximumFractionDigits: 20,
    minimumFractionDigits: Math.min(20, Math.max(0, ...decimals)), // Same amount of decimals for all ticks
  });
  return format;
};

const getText = (node: Node): string =>
  Array.from(node.childNodes, (child) => {
    if (child.nodeType === 3) return child.nodeValue || '';
    return child.nodeType === 1 && !(child as Element).matches(SKIP_TEXT)
      ? getText(child)
      : ' ';
  }).join('');

// Parse the first number in formatted texts such as "1 234,5 kr", "1.234,5" or "$1,234.5".
// Language of the element is only used when it is unclear if a single comma or period is a decimal separator
const getNumberParser = (el: Element) => {
  const parts = new Intl.NumberFormat(getLocale(el)).formatToParts(1.5);
  const decimal = parts.find(({ type }) => type === 'decimal')?.value || '.';

  return (cell: Element) => {
    const value = getNumber(cell, ATTR_VALUE);
    if (attr(cell, ATTR_VALUE)?.trim()) return value; // data-value is always a machine readable number

    const text = getText(cell).replace(MINUS, '-');
    const match = text.match(NUMBER);
    if (!match) return Number.NaN;

    const prefix = text.slice(0, match.index).trim(); // Minus can be both before and after prefixes, such as "-kr 5" and "kr -5"
    const sign = prefix.startsWith('-') || prefix.endsWith('-') ? -1 : 1;
    const digits = match[0].replace(/[\s'’]/g, '').replace(/[.,]+$/, '');
    const separators = digits.replace(/\d/g, '');
    const last = separators.slice(-1);
    const isGroupOnly =
      separators.length > 1
        ? separators === last.repeat(separators.length) // Same separator multiple times, such as "1.234.567"
        : last !== decimal && /^\d{1,3}[.,]\d{3}$/.test(digits); // Single separator in front of three digits, such as "1.500" in Norwegian

    return (
      sign *
      Number.parseFloat(
        digits
          .split(isGroupOnly ? /[.,]/ : last === ',' ? '.' : ',') // Remove group separators
          .join('')
          .replace(',', '.'),
      )
    );
  };
};

// Setting CSS properties individually to prevent issues with CSP
const setStyle = (el: HTMLElement, name: string, value: string | null) => {
  if (value === null) el.style.removeProperty(name);
  else if (el.style.getPropertyValue(name) !== value)
    el.style.setProperty(name, value);
};

customElements.define('ds-chart', DSChartElement);
