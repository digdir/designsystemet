import type { CSSProperties } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import type { ChartProps } from '../../';
import { EXPERIMENTAL_Chart as Chart, Table, ToggleGroup } from '../../';

const meta = preview.meta({
  title: 'Komponenter/Chart',
  component: Chart,
  argTypes: {
    'data-variant': {
      control: 'radio',
      options: ['column', 'bar', 'line', 'table'],
    },
    'data-stacked': { control: 'boolean' },
    'data-show-values': { control: 'boolean' },
  },
});

const years = [
  { year: 2022, granted: 1240, rejected: 310, withdrawn: 95 },
  { year: 2023, granted: 1480, rejected: 290, withdrawn: 120 },
  { year: 2024, granted: 1310, rejected: 420, withdrawn: 80 },
  { year: 2025, granted: 1720, rejected: 380, withdrawn: 140 },
];
const number = new Intl.NumberFormat('nb');

const DataTable = () => (
  <Table>
    <caption>Søknader per år</caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>År</Table.HeaderCell>
        <Table.HeaderCell>Innvilget</Table.HeaderCell>
        <Table.HeaderCell>Avslått</Table.HeaderCell>
        <Table.HeaderCell>Trukket</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {years.map(({ year, granted, rejected, withdrawn }) => (
        <Table.Row key={year}>
          <Table.HeaderCell scope='row'>{year}</Table.HeaderCell>
          <Table.Cell data-value={granted}>{number.format(granted)}</Table.Cell>
          <Table.Cell data-value={rejected}>
            {number.format(rejected)}
          </Table.Cell>
          <Table.Cell data-value={withdrawn}>
            {number.format(withdrawn)}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const render = (args: ChartProps) => (
  <Chart {...args}>
    <DataTable />
  </Chart>
);

export const Preview = meta.story({
  args: { 'data-variant': 'column' },
  render,
});

export const Bar = meta.story({
  args: { 'data-variant': 'bar' },
  render,
});

export const Line = meta.story({
  args: { 'data-variant': 'line' },
  render,
});

export const Stacked = meta.story({
  args: { 'data-variant': 'column', 'data-stacked': true },
  render,
});

export const ShowValues = meta.story({
  args: { 'data-variant': 'column', 'data-show-values': true },
  render,
});

/**
 * Any radio or select with `data-chart="variant"` inside the chart switches
 * variant, so users can choose to read the numbers as a table.
 */
export const WithTableToggle = meta.story({
  render: (args) => (
    <Chart {...args}>
      <ToggleGroup
        aria-label='Visning'
        data-chart='variant'
        defaultValue='column'
      >
        <ToggleGroup.Item value='column'>Diagram</ToggleGroup.Item>
        <ToggleGroup.Item value='table'>Tabell</ToggleGroup.Item>
      </ToggleGroup>
      <DataTable />
    </Chart>
  ),
});

export const CustomColors = meta.story({
  args: { 'data-variant': 'column' },
  render: (args) => (
    <Chart
      {...args}
      style={
        {
          '--dsc-chart-color-2': 'var(--ds-color-brand1-base-default)',
          '--dsc-chart-color-3': 'var(--ds-color-brand2-base-default)',
          '--dsc-chart-size': '20rem',
        } as CSSProperties
      }
    >
      <DataTable />
    </Chart>
  ),
});
