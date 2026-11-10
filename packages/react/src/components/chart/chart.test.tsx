import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from '../table';
import { EXPERIMENTAL_Chart as Chart } from './';

const renderChart = (props = {}) =>
  render(
    <Chart {...props}>
      <Table>
        <caption>Applications</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Year</Table.HeaderCell>
            <Table.HeaderCell>Granted</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell scope='row'>2024</Table.HeaderCell>
            <Table.Cell>50</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell scope='row'>2025</Table.HeaderCell>
            <Table.Cell>100</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Chart>,
  );

describe('Chart', () => {
  it('renders ds-chart with the table as an accessible table', () => {
    const { container } = renderChart({ className: 'custom' });
    const chart = container.querySelector('ds-chart');

    expect(chart).toHaveClass('ds-chart', 'custom');
    expect(screen.getByRole('table', { name: 'Applications' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Granted' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '100' })).toHaveStyle({
      '--_ds-chart-to': '1',
    });
  });

  it('passes attributes to ds-chart', () => {
    const { container } = renderChart({
      'data-variant': 'bar',
      'data-stacked': true,
      'data-show-values': false,
    });
    const chart = container.querySelector('ds-chart');

    expect(chart).toHaveAttribute('data-variant', 'bar');
    expect(chart).toHaveAttribute('data-stacked'); // React sets booleans as empty attribute on custom elements
    expect(chart).not.toHaveAttribute('data-show-values');
  });
});
