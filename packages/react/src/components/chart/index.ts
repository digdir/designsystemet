import { Chart } from './chart';

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
const EXPERIMENTAL_Chart = Chart;

export type { ChartProps } from './chart';
export { EXPERIMENTAL_Chart };
