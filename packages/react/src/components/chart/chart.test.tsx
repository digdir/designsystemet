import type { DSChartElement } from '@digdir/designsystemet-web';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type Ref } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Table } from '../table';
import { ToggleGroup } from '../toggle-group';
import { EXPERIMENTAL_Chart as Chart, type ChartProps } from './';

const tick = () => new Promise((resolve) => setTimeout(resolve)); // Let MutationObserver run

const ChartWithTable = ({
  chartRef,
  value = 100,
  ...props
}: ChartProps & { chartRef?: Ref<DSChartElement>; value?: number }) => (
  <Chart ref={chartRef} {...props}>
    <ToggleGroup aria-label='View' data-chart='variant' defaultValue='column'>
      <ToggleGroup.Item value='column'>Chart</ToggleGroup.Item>
      <ToggleGroup.Item value='table'>Table</ToggleGroup.Item>
    </ToggleGroup>
    <Table>
      <caption>Applications</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope='col'>Year</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Granted</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
          <Table.Cell>50</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
          <Table.Cell style={{ color: 'red' }}>{value}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Chart>
);

describe('Chart', () => {
  it('renders ds-chart with the table as an accessible table', () => {
    const ref = createRef<DSChartElement>();
    const { container } = render(
      <ChartWithTable chartRef={ref} className='custom' />,
    );
    const chart = container.querySelector('ds-chart');

    expect(ref.current).toBe(chart);
    expect(chart).toHaveClass('ds-chart', 'custom');
    expect(screen.getByRole('table', { name: 'Applications' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Granted' })).toBeVisible();
    expect(screen.getByRole('rowheader', { name: '2025' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '100' })).toHaveStyle({
      '--_ds-chart-to': '1',
    });
  });

  it('passes attributes to ds-chart', () => {
    const { container } = render(
      <ChartWithTable
        data-max={200}
        data-min={-100}
        data-show-values={false}
        data-stacked
        data-variant='bar'
      />,
    );
    const chart = container.querySelector('ds-chart');

    expect(chart).toHaveAttribute('data-variant', 'bar');
    expect(chart).toHaveAttribute('data-max', '200');
    expect(chart).toHaveAttribute('data-min', '-100');
    expect(chart).toHaveAttribute('data-stacked'); // React 18 sets "true" and React 19 sets empty attribute on custom elements
    expect(chart).not.toHaveAttribute('data-show-values');
  });

  it('updates when cells are re-rendered, and keeps styles from consumer', async () => {
    const { rerender } = render(<ChartWithTable value={100} />);
    rerender(<ChartWithTable value={25} />);
    await tick();

    const cell = screen.getByRole('cell', { name: '25' });
    expect(cell).toHaveStyle({
      '--_ds-chart-to': '0.5',
      color: 'rgb(255, 0, 0)',
    });
  });

  it('lets a control with data-chart="variant" switch to table, also after re-render', async () => {
    const { container, rerender } = render(<ChartWithTable />);
    const chart = container.querySelector('ds-chart');

    await userEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(chart).toHaveAttribute('data-variant', 'table');

    rerender(<ChartWithTable value={25} />);
    expect(chart).toHaveAttribute('data-variant', 'table');
  });

  it('hydrates without warnings when ds-chart has added attributes', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = renderToString(<ChartWithTable />);
    await tick();

    const cell = container.querySelector('td');
    expect(cell).toHaveAttribute('role', 'cell'); // Added by ds-chart before hydration

    const root = await act(() => hydrateRoot(container, <ChartWithTable />));
    expect(error).not.toHaveBeenCalled();
    expect(cell).toHaveAttribute('role', 'cell');
    expect(cell).toHaveStyle({ '--_ds-chart-to': '0.5' });

    act(() => root.unmount());
    container.remove();
    error.mockRestore();
  });

  it('only suppresses hydration warnings for tables inside Chart', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const table = (text: string) => (
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{text}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = renderToString(table('server'));

    const onRecoverableError = vi.fn();
    const root = await act(() =>
      hydrateRoot(container, table('client'), { onRecoverableError }),
    );
    const reports =
      error.mock.calls.length + onRecoverableError.mock.calls.length;
    expect(reports).toBeGreaterThan(0); // Text mismatch is still reported for regular tables
    expect(container).toHaveTextContent('client');

    act(() => root.unmount());
    container.remove();
    error.mockRestore();
  });
});
