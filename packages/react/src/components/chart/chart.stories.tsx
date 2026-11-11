import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import type { ChartProps } from '../../';
import {
  EXPERIMENTAL_Chart as Chart,
  Switch,
  Table,
  ToggleGroup,
} from '../../';

const meta = preview.meta({
  title: 'Komponenter/Chart',
  component: Chart,
  argTypes: {
    'data-variant': {
      control: 'radio',
      options: ['column', 'bar', 'line', 'area', 'pie', 'donut', 'table'],
    },
    'data-stacked': { control: 'boolean' },
    'data-show-values': { control: 'boolean' },
  },
});

type Data = {
  caption: string;
  head: string[];
  rows: [string, ...number[]][];
  foot?: string;
};

// Example data is inspired by the kind of statistics published on ssb.no, but all numbers are made up
const cars: Data = {
  caption: 'Nye personbiler etter drivstoff',
  head: ['År', 'Elbil', 'Ladbar hybrid', 'Bensin og diesel'],
  rows: [
    ['2021', 96500, 38200, 28400],
    ['2022', 121000, 24600, 17900],
    ['2023', 108300, 13100, 11200],
    ['2024', 126700, 8900, 6300],
  ],
  foot: 'Eksempeldata inspirert av statistikk fra ssb.no',
};

const unemployment: Data = {
  caption: 'Arbeidsledige etter alder, prosent av arbeidsstyrken',
  head: ['År', '15–24 år', '25–54 år', '55–74 år'],
  rows: [
    ['2021', 12.4, 4.1, 2.2],
    ['2022', 10.1, 3, 1.6],
    ['2023', 10.8, 3.2, 1.5],
    ['2024', 11.9, 3.6, 1.8],
    ['2025', 11.3, 3.4, 1.9],
  ],
};

const jobs: Data = {
  caption: 'Jobber etter næring, i tusen',
  head: ['Næring', 'Kvinner', 'Menn'],
  rows: [
    ['Helse- og sosialtjenester', 438, 126],
    ['Varehandel', 171, 188],
    ['Bygge- og anleggsvirksomhet', 27, 229],
    ['Undervisning', 149, 84],
    ['Industri', 58, 163],
  ],
};

const journeys: Data = {
  caption: 'Kollektivreiser etter transportmiddel, millioner',
  head: ['År', 'Buss', 'T-bane og trikk', 'Tog'],
  rows: [
    ['2021', 248, 116, 43],
    ['2022', 312, 161, 66],
    ['2023', 341, 183, 77],
    ['2024', 356, 192, 82],
  ],
};

const guestNights: Data = {
  caption: 'Overnattinger om sommeren, millioner',
  head: ['Måned', 'Hotell', 'Camping'],
  rows: [
    ['Juni', 2.4, 1.3],
    ['Juli', 3.2, 2.7],
    ['August', 2.8, 1.8],
  ],
};

const dwellings: Data = {
  caption: 'Fullførte boliger etter bygningstype',
  head: ['År', 'Enebolig', 'Rekkehus', 'Blokk'],
  rows: [
    ['2021', 6200, 5400, 14800],
    ['2022', 5800, 5900, 15900],
    ['2023', 5100, 5000, 13200],
    ['2024', 4300, 4100, 10400],
  ],
};

const energy: Data = {
  caption: 'Strømproduksjon etter kilde, TWh',
  head: ['År', 'Vannkraft', 'Vindkraft', 'Solkraft'],
  rows: [
    ['2022', 127, 14, 2],
    ['2023', 134, 15, 4],
    ['2024', 139, 17, 7],
  ],
};

const waste: Data = {
  caption: 'Husholdningsavfall per innbygger etter materiale, kg',
  head: ['År', 'Restavfall', 'Matavfall', 'Papir', 'Glass', 'Plast', 'Metall'],
  rows: [
    ['2022', 172, 62, 48, 19, 12, 9],
    ['2023', 165, 68, 44, 20, 14, 9],
    ['2024', 158, 74, 41, 21, 17, 10],
  ],
};

const households: Data = {
  caption: 'Husholdninger etter type, prosent',
  head: ['Husholdningstype', 'Andel'],
  rows: [
    ['Aleneboende', 39],
    ['Par uten barn', 24],
    ['Par med barn', 21],
    ['Enslig med barn', 6],
    ['Andre husholdninger', 10],
  ],
};

const production: Data = {
  caption: 'Strømproduksjon etter kilde, TWh',
  head: ['År', 'Vannkraft', 'Vindkraft', 'Solkraft'],
  rows: [
    ['2019', 124, 6, 0.1],
    ['2020', 139, 10, 0.2],
    ['2021', 142, 12, 0.4],
    ['2022', 127, 14, 1.5],
    ['2023', 134, 15, 4],
    ['2024', 139, 17, 7],
  ],
};

const heating: Data = {
  caption: 'Hovedkilde til oppvarming i boliger, prosent',
  head: ['Oppvarming', 'Andel'],
  rows: [
    ['Varmepumpe', 46],
    ['Panelovner', 29],
    ['Vedovn', 14],
    ['Fjernvarme', 11],
  ],
};

const number = new Intl.NumberFormat('nb');

const DataTable = ({ caption, head, rows, foot }: Data) => (
  <Table>
    <caption>{caption}</caption>
    <Table.Head>
      <Table.Row>
        {head.map((name) => (
          <Table.HeaderCell key={name} scope='col'>
            {name}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {rows.map(([category, ...values]) => (
        <Table.Row key={category}>
          <Table.HeaderCell scope='row'>{category}</Table.HeaderCell>
          {values.map((value, index) => (
            <Table.Cell key={head[index + 1]}>
              {number.format(value)}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
    {foot && (
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={head.length}>{foot}</Table.Cell>
        </Table.Row>
      </Table.Foot>
    )}
  </Table>
);

export const Preview = meta.story({
  args: { 'data-variant': 'column' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...cars} />
    </Chart>
  ),
});

export const Line = meta.story({
  args: { 'data-variant': 'line' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...unemployment} />
    </Chart>
  ),
});

export const Bar = meta.story({
  args: { 'data-variant': 'bar' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...jobs} />
    </Chart>
  ),
});

export const Stacked = meta.story({
  args: { 'data-variant': 'column', 'data-stacked': true },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...journeys} />
    </Chart>
  ),
});

export const ShowValues = meta.story({
  args: { 'data-variant': 'column', 'data-show-values': true },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...guestNights} />
    </Chart>
  ),
});

/**
 * Any radio or select with `data-chart="variant"`, or inside an element with
 * the attribute, switches variant so users can read the numbers as a table.
 */
export const WithTableToggle = meta.story({
  render: (args: ChartProps) => (
    <Chart {...args}>
      <ToggleGroup
        aria-label='Visning'
        data-chart='variant'
        defaultValue='column'
      >
        <ToggleGroup.Item value='column'>Diagram</ToggleGroup.Item>
        <ToggleGroup.Item value='table'>Tabell</ToggleGroup.Item>
      </ToggleGroup>
      <DataTable {...dwellings} />
    </Chart>
  ),
});

/**
 * Each row is a slice, and the table is shown as legend with the values.
 * Use for parts of a whole, with six rows at most.
 */
export const Pie = meta.story({
  args: { 'data-variant': 'pie' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...households} />
    </Chart>
  ),
});

/**
 * Pie with a hole. Change the size of the hole with `--dsc-chart-hole-size`.
 */
export const Donut = meta.story({
  args: { 'data-variant': 'donut' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...heating} />
    </Chart>
  ),
});

/**
 * Areas are always stacked, as areas on top of each other would hide values.
 */
export const Area = meta.story({
  args: { 'data-variant': 'area' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...production} />
    </Chart>
  ),
});

/**
 * Chart has six combinations of color, pattern and shape, so six series is the
 * most a chart can show before the combinations repeat.
 */
export const SixSeries = meta.story({
  args: { 'data-variant': 'column' },
  render: (args: ChartProps) => (
    <Chart {...args}>
      <DataTable {...waste} />
    </Chart>
  ),
});

export const CustomColors = meta.story({
  args: { 'data-variant': 'bar', 'data-stacked': true },
  render: (args: ChartProps) => (
    <Chart
      {...args}
      style={
        {
          '--dsc-chart-color-1': 'var(--ds-color-brand1-border-default)',
          '--dsc-chart-color-2': 'var(--ds-color-brand1-text-default)',
          '--dsc-chart-color-3': 'var(--ds-color-brand2-border-default)',
          '--dsc-chart-size': '20rem',
        } as CSSProperties
      }
    >
      <DataTable {...energy} />
    </Chart>
  ),
});

/**
 * The chart follows the table, so updating the table updates the chart.
 * Shows real measurements from your browser: frames drawn and pointer movements per second.
 * Content that updates automatically must be possible to pause (WCAG 2.2.2).
 */
const LiveChart = () => {
  const [live, setLive] = useState(true);
  const [rows, setRows] = useState<[number, string, number, number][]>([]);

  useEffect(() => {
    if (!live) return;
    let frames = 0;
    let moves = 0;
    let frame = requestAnimationFrame(function count() {
      frames++;
      frame = requestAnimationFrame(count);
    });
    const onMove = () => moves++;
    const timer = setInterval(() => {
      const time = new Date().toLocaleTimeString('nb');
      setRows((rows) => [
        ...rows.slice(-7), // Keep the last 8 seconds
        [(rows.at(-1)?.[0] ?? 0) + 1, time, frames, moves],
      ]);
      frames = moves = 0;
    }, 1000);

    document.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      document.removeEventListener('pointermove', onMove);
    };
  }, [live]);

  return (
    <Chart data-variant='line'>
      <Switch
        checked={live}
        label='Oppdater hvert sekund'
        onChange={(event) => setLive(event.target.checked)}
      />
      <ToggleGroup
        aria-label='Visning'
        data-chart='variant'
        defaultValue='line'
      >
        <ToggleGroup.Item value='line'>Diagram</ToggleGroup.Item>
        <ToggleGroup.Item value='table'>Tabell</ToggleGroup.Item>
      </ToggleGroup>
      <Table>
        <caption>Aktivitet i nettleseren din de siste sekundene</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>Klokkeslett</Table.HeaderCell>
            <Table.HeaderCell scope='col'>Bilder tegnet</Table.HeaderCell>
            <Table.HeaderCell scope='col'>Pekerbevegelser</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map(([id, time, frames, moves]) => (
            <Table.Row key={id}>
              <Table.HeaderCell scope='row'>{time}</Table.HeaderCell>
              <Table.Cell>{frames}</Table.Cell>
              <Table.Cell>{moves}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Chart>
  );
};

export const LiveData = meta.story({
  render: () => <LiveChart />,
  parameters: { chromatic: { disableSnapshot: true } }, // Changes every second
});
