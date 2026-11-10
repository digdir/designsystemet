import type { DSChartElement } from '@digdir/designsystemet-web';
import '@digdir/designsystemet-web'; // Import ds-chart custom element
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type ChartProps = MergeRight<
  DefaultProps & HTMLAttributes<DSChartElement>,
  {
    /**
     * How to draw the table. Use `table` to show the plain table.
     * @default 'column'
     */
    'data-variant'?: 'column' | 'bar' | 'line' | 'table';
    /**
     * Stack the values of each row on top of each other. Only for `column` and `bar`.
     * @default false
     */
    'data-stacked'?: boolean;
    /**
     * Always show values in the chart. `bar` always shows values.
     * @default false
     */
    'data-show-values'?: boolean;
    /**
     * Lowest value on the axis. Is rounded down to a nice number, and never above 0.
     * @default 0
     */
    'data-min'?: number | string;
    /**
     * Highest value on the axis. Is rounded up to a nice number.
     * @default Highest value in the table
     */
    'data-max'?: number | string;
  }
>;

/**
 * Chart draws its child `Table` as a chart. The table is the data, the legend and the accessible alternative.
 *
 * @example
 * <Chart data-variant='column'>
 *   <Table>
 *     <caption>Applications per year</caption>
 *     <Table.Head>
 *       <Table.Row>
 *         <Table.HeaderCell>Year</Table.HeaderCell>
 *         <Table.HeaderCell>Granted</Table.HeaderCell>
 *       </Table.Row>
 *     </Table.Head>
 *     <Table.Body>
 *       <Table.Row>
 *         <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
 *         <Table.Cell>1 310</Table.Cell>
 *       </Table.Row>
 *     </Table.Body>
 *   </Table>
 * </Chart>
 */
export const Chart = forwardRef<DSChartElement, ChartProps>(function Chart(
  {
    className,
    'data-stacked': stacked,
    'data-show-values': showValues,
    ...rest
  },
  ref,
) {
  return (
    <ds-chart
      class={cl('ds-chart', className)}
      data-show-values={showValues || undefined}
      data-stacked={stacked || undefined}
      ref={ref}
      suppressHydrationWarning // Since ds-chart adds style attribute
      {...rest}
    />
  );
});
