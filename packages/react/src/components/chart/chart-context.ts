import { createContext } from 'react';

/**
 * Tells Table parts that they are rendered inside a Chart, so they can turn on `suppressHydrationWarning`.
 *
 * Why the flag is needed inside Chart:
 * <ds-chart> adds `role` and `style` to the table elements as soon as it is defined,
 * which is before React hydrates. Without the flag, React reports a hydration mismatch for every table element.
 *
 * Why the flag is not always on, which would have removed the need for a context:
 * On elements with text, such as <td> and <th>, `suppressHydrationWarning` does more than hiding a warning.
 * If the server and client render different text (i.e. a date or number formatted with another timezone or locale),
 * React 19 keeps the text from the server without reporting it, and the text stays wrong until the value changes.
 * Without the flag, React reports the mismatch and shows the text from the client.
 * Always having the flag on would thus give this bug to everyone using Table, also those not using Chart.
 *
 * This is covered by "only suppresses hydration warnings for tables inside Chart" in chart.test.tsx
 */
export const ChartContext = createContext(false);
