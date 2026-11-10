/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import { chartScale } from './chart';

const tick = async (_?: unknown) =>
  await new Promise((resolve) => setTimeout(resolve)); // Let MutationObserver run Loop

const render = async (attrs = '', rows = '') => {
  document.body.innerHTML = `
    <ds-chart lang="nb" ${attrs}>
      <fieldset data-chart="variant">
        <label><input type="radio" name="view" value="column" checked />Chart</label>
        <label><input type="radio" name="view" value="table" />Table</label>
      </fieldset>
      <table>
        <caption>Applications</caption>
        <thead>
          <tr><th>Year</th><th>Granted</th><th>Rejected</th></tr>
        </thead>
        <tbody>${
          rows ||
          `<tr><th scope="row">2024</th><td>1 500</td><td>250</td></tr>
          <tr><th scope="row">2025</th><td>2 000</td><td>500</td></tr>`
        }</tbody>
      </table>
    </ds-chart>
  `;
  const chart = document.querySelector('ds-chart') as HTMLElement;
  const cells = [...chart.querySelectorAll('td')];
  const css = (el: HTMLElement, name: string) =>
    el.style.getPropertyValue(`--_ds-chart-${name}`).replace(/\s/g, ' '); // Normalize non-breaking spaces

  await tick(); // Let mutation observer run

  return { chart, cells, css, table: chart.querySelector('table') };
};

describe('chartScale', () => {
  it('rounds to human friendly numbers', () => {
    expect(chartScale(0, 1720)).toEqual({
      min: 0,
      max: 2000,
      step: 500,
      ticks: [2000, 1500, 1000, 500, 0],
    });
    expect(chartScale(-20, 75).ticks).toEqual([80, 60, 40, 20, 0, -20]);
    expect(chartScale(0, 0.9).ticks).toEqual([1, 0.8, 0.6, 0.4, 0.2, 0]);
  });

  it('always returns a range', () => {
    expect(chartScale(0, 0).max).toBeGreaterThan(0);
    expect(chartScale(5, 5).ticks.length).toBeGreaterThan(1);
  });
});

describe('ds-chart', () => {
  it('sets scale on chart and position on cells', async () => {
    const { chart, cells, css } = await render();

    expect(css(chart, 'steps')).toBe('4');
    expect(css(chart, 'series')).toBe('2');
    expect(css(chart, 'zero')).toBe('0');
    expect(css(chart, 'axis')).toBe('"2 000\\a 1 500\\a 1 000\\a 500\\a 0"');
    expect(cells.map((cell) => css(cell, 'to'))).toEqual([
      '0.75',
      '0.125',
      '1',
      '0.25',
    ]);
    expect(cells.map((cell) => css(cell, 'from'))).toEqual([
      '0',
      '0',
      '0',
      '0',
    ]);
    expect(cells.map((cell) => css(cell, 'next'))).toEqual([
      '1',
      '0.25',
      '',
      '',
    ]);
  });

  it('keeps table semantics', async () => {
    const { table, cells } = await render();

    expect(table).toHaveAttribute('role', 'table');
    expect(table?.tHead).toHaveAttribute('role', 'rowgroup');
    expect(table?.rows[0]).toHaveAttribute('role', 'row');
    expect(table?.rows[0].cells[1]).toHaveAttribute('role', 'columnheader');
    expect(table?.rows[1].cells[0]).toHaveAttribute('role', 'rowheader');
    expect(cells[0]).toHaveAttribute('role', 'cell');
    expect(cells[0]).toHaveTextContent('1 500'); // Content is never changed
  });

  it('stacks values when data-stacked', async () => {
    const { chart, cells, css } = await render('data-stacked');

    expect(css(chart, 'axis')).toContain('"2 500');
    expect(css(cells[0], 'to')).toBe('0.6');
    expect(css(cells[1], 'from')).toBe('0.6');
    expect(css(cells[1], 'to')).toBe('0.7');
    expect(css(cells[3], 'from')).toBe('0.8');
    expect(css(cells[3], 'to')).toBe('1');
  });

  it('does not stack lines', async () => {
    const { cells, css } = await render('data-stacked data-variant="line"');
    expect(css(cells[3], 'from')).toBe('0');
  });

  it('supports negative and missing values', async () => {
    const { chart, cells, css } = await render(
      '',
      `<tr><th>A</th><td>-50</td><td>100</td></tr>
       <tr><th>B</th><td>–</td><td>−100</td></tr>`,
    );

    expect(css(chart, 'zero')).toBe('0.5');
    expect(css(cells[0], 'from')).toBe('0.25');
    expect(css(cells[0], 'to')).toBe('0.5');
    expect(css(cells[0], 'next')).toBe(''); // Next value is missing
    expect(css(cells[2], 'value')).toBe('');
    expect(css(cells[2], 'to')).toBe('');
    expect(css(cells[3], 'value')).toBe('0');
  });

  it('parses numbers based on language', async () => {
    const rows = (a: string, b: string) =>
      `<tr><th>A</th><td>${a}</td><td data-value="50">${b}</td></tr>`;
    const nb = await render('', rows('kr 1&nbsp;234,5', 'Fifty'));
    expect(nb.css(nb.chart, 'axis')).toContain('"1 500');
    expect(nb.css(nb.cells[1], 'to')).toBe('0.0333'); // data-value wins over text

    const en = await render('', rows('$1,234.5', '0'));
    en.chart.setAttribute('lang', 'en');
    en.chart.setAttribute('data-max', '2000'); // Trigger render
    await tick();
    expect(en.css(en.cells[0], 'to')).toBe('0.6173');
  });

  it('respects data-min and data-max', async () => {
    const { chart, cells, css } = await render(
      'data-max="4000" data-min="-1000"',
    );

    expect(css(chart, 'axis')).toContain('"4 000');
    expect(css(chart, 'axis')).toContain('\u22121 000"'); // Norwegian uses minus sign, not hyphen
    expect(css(chart, 'zero')).toBe('0.2');
    expect(css(cells[2], 'to')).toBe('0.6');
  });

  it('updates when table content changes', async () => {
    const { chart, cells, css } = await render();

    cells[2].textContent = '8 000';
    await tick();
    expect(css(chart, 'axis')).toContain('"8 000');
    expect(css(cells[2], 'to')).toBe('1');

    cells[2].setAttribute('data-value', '4000');
    await tick();
    expect(css(chart, 'axis')).toContain('"4 000');
  });

  it('switches variant from controls with data-chart="variant"', async () => {
    const { chart } = await render();
    const radio = chart.querySelector<HTMLInputElement>('[value="table"]');

    radio?.click();
    expect(chart).toHaveAttribute('data-variant', 'table');
  });
});
