export type SuggestionItem = { label: string; value: string };
export type SuggestionValue = SuggestionItem | string | null | undefined;
type Select = Partial<GlobalEventHandlersEventMap['comboboxbeforeselect']>;
type Render<R> = (item: SuggestionItem, index: number) => R;

const toItem = (v: SuggestionValue): SuggestionItem | null =>
  typeof v === 'string' ? (v ? { label: v, value: v } : null) : v || null;

/**
 * Helper to sanitize, update or render selected suggestion value, for easier controlled <ds-suggestion> in frameworks.
 * - No action: Returns the value sanitized to `{ label, value }` (non-empty strings become `{ label: string, value: string }`)
 * - Action comboboxbeforeselect: Prevents event and returns modified value
 * - Action function: Calls the function with each sanitized item and returns the results
 *
 * @param value Selected item(s). Pass an array in multiple mode, or a single item, string or null in single mode
 * @param [action] Optional comboboxbeforeselect event to apply, or function to render each item
 * @returns Array when `value` is an array, otherwise a single result or null when there is no item
 * @example
 * const [selected, setSelected] = useState(suggestion([]));
 * <Suggestion data-multiple oncomboboxbeforeselect={(event) => setSelected(suggestion(selected, event))}>
 *   {suggestion(selected, ({ label, value }) => <data key={value} value={value}>{label}</data>)}
 * </Suggestion>
 */
export function suggestion(
  value: readonly SuggestionValue[],
  action?: Select,
): SuggestionItem[];
export function suggestion<R>(
  value: readonly SuggestionValue[],
  action: Render<R>,
): R[];
export function suggestion(
  value: SuggestionValue,
  action?: Select,
): SuggestionItem | null;
export function suggestion<R>(
  value: SuggestionValue,
  action: Render<R>,
): R | null;
export function suggestion<R>(
  value: SuggestionValue | readonly SuggestionValue[],
  action?: Select | Render<R>,
) {
  const items = Array.isArray(value)
    ? value.map(toItem).filter((item) => item !== null)
    : toItem(value as SuggestionValue);

  if (!action) return items;
  if (typeof action === 'function') {
    // Checked typeof 'function' for action (not instanceof Event) to support server side rendering
    if (Array.isArray(items)) return items.map(action);
    return items && action(items, 0);
  }

  action.preventDefault?.(); // Let the framework do rendering
  const { isConnected, textContent = '', value: data } = action.detail || {};
  const label = textContent.trim();
  const item = { label, value: data || label }; // <data> without value attribute uses its text as value

  if (!Array.isArray(items)) return isConnected ? null : item;
  console.log({ items, item });
  const rest = items.filter(({ value }) => value !== item.value); // Also prevents duplicates if state is out of sync
  return isConnected ? rest : [...rest, item];
}
