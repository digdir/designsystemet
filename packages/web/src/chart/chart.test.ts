/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
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

  it('handles extreme input', () => {
    expect(chartScale(Number.NaN, 5).ticks).toEqual([5, 4, 3, 2, 1, 0]);
    expect(chartScale(0, Number.POSITIVE_INFINITY).max).toBe(1);
    expect(chartScale(0, 100, 1e6).ticks.length).toBeLessThan(30);
    expect(chartScale(0, 100, Number.NaN).ticks).toEqual([
      100, 80, 60, 40, 20, 0,
    ]);
    expect(chartScale(0, 0.3).max).toBe(0.3);
    expect(Object.is(chartScale(-100, 0).max, 0)).toBe(true); // Not negative zero
    expect(chartScale(0, 1e-101).ticks.length).toBeGreaterThan(1);
    expect(chartScale(1e17, 1e17).ticks.every(Number.isFinite)).toBe(true);
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

  it('tells CSS how many characters each value has', async () => {
    const { chart, cells, css } = await render();

    expect(cells.map((cell) => css(cell, 'chars'))).toEqual([
      '5',
      '3',
      '5',
      '3',
    ]);
    expect(css(chart, 'max-chars')).toBe('5');
  });

  it('formats axis with the decimals needed', async () => {
    const axis = async (a: string, b: string) => {
      const { chart, css } = await render(
        '',
        `<tr><th>A</th><td>${a}</td><td>${b}</td></tr>`,
      );
      return css(chart, 'axis');
    };

    expect(await axis('0,5', '1')).toBe(
      '"1,0\\a 0,8\\a 0,6\\a 0,4\\a 0,2\\a 0,0"',
    );
    expect(await axis('0,01', '0,09')).toBe(
      '"0,10\\a 0,08\\a 0,06\\a 0,04\\a 0,02\\a 0,00"',
    );
    expect(await axis('12,4', '3,1')).toBe('"15\\a 10\\a 5\\a 0"');
    expect(await axis('0', '0')).toBe(
      '"1,0\\a 0,8\\a 0,6\\a 0,4\\a 0,2\\a 0,0"',
    );
  });

  it('draws first value of each row as slices when pie', async () => {
    const { cells, css } = await render(
      'data-variant="pie"',
      `<tr><th>A</th><td>50</td><td>999</td></tr>
       <tr><th>B</th><td>-10</td><td>999</td></tr>
       <tr><th>C</th><td>–</td><td>999</td></tr>
       <tr><th>D</th><td>150</td><td>999</td></tr>`,
    );
    const slice = (cell: HTMLElement) =>
      `${css(cell, 'from')}-${css(cell, 'to')}`;

    expect(slice(cells[0])).toBe('0-0.25');
    expect(slice(cells[2])).toBe('-'); // Negative values can not be slices
    expect(slice(cells[4])).toBe('-'); // Missing values are skipped
    expect(slice(cells[6])).toBe('0.25-1');
    expect(css(cells[6], 'value')).toBe('0.75'); // Share of total
    expect(slice(cells[1])).toBe('-'); // Only first value is drawn
    expect(cells[1]).toHaveAttribute('role', 'cell');
  });

  it('draws donut as pie', async () => {
    const { cells, css } = await render(
      'data-variant="donut"',
      `<tr><th>A</th><td>1</td></tr><tr><th>B</th><td>3</td></tr>`,
    );
    expect(css(cells[1], 'from')).toBe('0.25');
    expect(css(cells[1], 'to')).toBe('1');
  });

  it('always stacks area, and tells where next value starts and ends', async () => {
    const { chart, cells, css } = await render(
      'data-variant="area"',
      `<tr><th>A</th><td>100</td><td>100</td></tr>
       <tr><th>B</th><td>50</td><td>150</td></tr>
       <tr><th>C</th><td>–</td><td>100</td></tr>`,
    );
    const area = (cell: HTMLElement) =>
      ['value', 'from', 'to', 'next-from', 'next']
        .map((name) => css(cell, name))
        .join(' ');

    expect(css(chart, 'axis')).toContain('"200'); // Highest sum
    expect(area(cells[0])).toBe('0.5 0 0.5 0 0.25');
    expect(area(cells[1])).toBe('1 0.5 1 0.25 1');
    expect(area(cells[2])).toBe('0.25 0 0.25  '); // Next value is missing
    expect(area(cells[3])).toBe('1 0.25 1 0 0.5');
    expect(area(cells[5])).toBe('0.5 0 0.5  '); // Last row

    chart.setAttribute('data-variant', 'line');
    expect(area(cells[1])).toBe('0.6667 0 0.6667  1'); // Lines are not stacked
  });

  it('warns when pie has more than six slices', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const rows = Array.from(
      { length: 7 },
      (_, i) => `<tr><th>${i}</th><td>1</td></tr>`,
    );
    await render('data-variant="pie"', rows.join(''));
    expect(log).toHaveBeenCalledTimes(1);
    log.mockRestore();
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

  it('parses formatted numbers', async () => {
    // Compares the cell with a sibling having the expected number as data-value
    const parses = async (lang: string, text: string, expected: number) => {
      const { chart, cells, css } = await render(
        '',
        `<tr><th>A</th><td>${text}</td><td data-value="${expected}"></td></tr>`,
      );
      chart.setAttribute('lang', lang);
      await tick();
      return css(cells[0], 'value') === css(cells[1], 'value');
    };

    expect(await parses('nb', '1.500', 1500)).toBe(true); // Period is thousand separator in Norwegian
    expect(await parses('nb', '1.234.567', 1234567)).toBe(true);
    expect(await parses('nb', '1.5', 1.5)).toBe(true);
    expect(await parses('en', '1,500', 1500)).toBe(true);
    expect(await parses('en', '1,5', 1.5)).toBe(true);
    expect(await parses('de', '1.234,5', 1234.5)).toBe(true);
    expect(await parses('de-CH', '1’234.5', 1234.5)).toBe(true);
    expect(await parses('nb', '1 500<sup>1</sup>', 1500)).toBe(true); // Footnotes are skipped
    expect(await parses('nb', '250 <a href="#note">2)</a>', 250)).toBe(true);
    expect(await parses('nb', '<span hidden>999</span>5', 5)).toBe(true);
    expect(await parses('nb', 'ca. 12,5 %', 12.5)).toBe(true);
    expect(await parses('nb', '.5', 0.5)).toBe(true);
    expect(await parses('nb', '-kr 50', -50)).toBe(true);
    expect(await parses('en', '-$5.00', -5)).toBe(true);
    expect(await parses('nb', '‑5', -5)).toBe(true); // Non-breaking hyphen
    expect(await parses('nb', '10–20', 10)).toBe(true); // First number of a range
    expect(await parses('nb', '1.500', 1.5)).toBe(false);

    const { cells, css } = await render('', `<tr><th>A</th><td>–</td></tr>`);
    expect(css(cells[0], 'value')).toBe(''); // Dash is missing value, not minus
  });

  it('never uses browser language when lang is unsupported or missing', async () => {
    for (const lang of ['nn', 'se', 'nb_NO', ' nb ', 'x', '']) {
      const { chart, cells, css } = await render(
        '',
        `<tr><th>A</th><td>1 234,5</td></tr>`,
      );
      chart.setAttribute('lang', lang);
      await tick();
      expect(css(chart, 'axis')).toContain('"1 500');
      expect(css(cells[0], 'to')).toBe('0.823');
    }
  });

  it('updates when lang changes', async () => {
    const { chart, css } = await render();
    chart.setAttribute('lang', 'en');
    expect(css(chart, 'axis')).toContain('"2,000');
  });

  it('ignores invalid data-value', async () => {
    const { cells, css } = await render(
      '',
      `<tr><th>A</th><td data-value="">50</td><td data-value="abc">100</td><td data-value="1,5">100</td><td>100</td></tr>`,
    );
    expect(css(cells[0], 'to')).toBe('0.5'); // Empty data-value falls back to text
    expect(css(cells[1], 'to')).toBe('');
    expect(css(cells[2], 'to')).toBe('');
  });

  it('does not draw lines between tbody elements', async () => {
    const { cells, css } = await render(
      'data-variant="line"',
      `<tr><th>A</th><td>1</td></tr><tr><th>B</th><td>2</td></tr></tbody>
       <tbody><tr><th>C</th><td>3</td></tr>`,
    );
    expect(css(cells[0], 'next')).toBe('0.6667');
    expect(css(cells[1], 'next')).toBe('');
  });

  it('stacks negative values separately', async () => {
    const { chart, cells, css } = await render(
      'data-stacked',
      `<tr><th>A</th><td>50</td><td>-50</td><td>50</td><td>-50</td><td>0</td></tr>`,
    );
    expect(css(chart, 'zero')).toBe('0.5');
    expect(
      cells.map((cell) => `${css(cell, 'from')}-${css(cell, 'to')}`),
    ).toEqual(['0.5-0.75', '0.25-0.5', '0.75-1', '0-0.25', '1-1']);
  });

  it('uses th-only rows as column headers and respects scope', async () => {
    const { table } = await render(
      '',
      `<tr><th>Year</th><th scope="ROW">B</th></tr><tr><th>2024</th><td>1</td></tr>`,
    );
    const [, header, row] = Array.from(table?.querySelectorAll('tr') || []);
    expect(header.children[0]).toHaveAttribute('role', 'columnheader');
    expect(header.children[1]).toHaveAttribute('role', 'rowheader');
    expect(row.children[0]).toHaveAttribute('role', 'rowheader');
  });

  it('keeps existing roles', async () => {
    const { cells } = await render(
      '',
      `<tr><th>A</th><td role="gridcell">1</td></tr>`,
    );
    expect(cells[0]).toHaveAttribute('role', 'gridcell');
  });

  it('warns once about missing caption and headers', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    document.body.innerHTML = `<ds-chart><table><tbody><tr><td>2024</td><td>1</td></tr></tbody></table></ds-chart>`;
    await tick();
    const cell = document.querySelector('td') as HTMLElement;
    cell.textContent = '2';
    await tick();
    cell.textContent = '3';
    await tick();
    expect(log).toHaveBeenCalledTimes(2); // One for caption and one for headers
    log.mockRestore();
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

  it('only lets data-min and data-max extend the axis', async () => {
    const { chart, cells, css } = await render(
      'data-max="1000" data-min="500"',
    );

    expect(css(chart, 'axis')).toContain('"2 000');
    expect(css(chart, 'zero')).toBe('0');
    expect(css(cells[2], 'to')).toBe('1'); // Never outside the chart

    chart.setAttribute('data-max', '1 000 000'); // Not a machine readable number
    expect(css(chart, 'axis')).toContain('"2 000');
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

  it('only switches variant from radios and selects of its own', async () => {
    const { chart } = await render('data-variant="line"');
    const group = chart.querySelector('fieldset') as HTMLElement;
    const change = (html: string, action: (el: HTMLInputElement) => void) => {
      group.insertAdjacentHTML('beforeend', html);
      const el = group.lastElementChild as HTMLInputElement;
      action(el);
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return chart.getAttribute('data-variant');
    };

    expect(change('<input type="text" />', (el) => (el.value = 'hello'))).toBe(
      'line',
    );
    expect(
      change(
        '<input type="checkbox" value="table" />',
        (el) => (el.checked = true),
      ),
    ).toBe('line');
    expect(
      change('<input type="radio" name="x" />', (el) => (el.checked = true)),
    ).toBe(null); // No value removes the variant
    expect(
      change('<select><option value="bar">Bar</option></select>', () => {}),
    ).toBe('bar');
    expect(
      change(
        '<ds-chart><select data-chart="variant"><option value="table">Table</option></select></ds-chart>',
        (el) =>
          el.firstElementChild?.dispatchEvent(
            new Event('change', { bubbles: true }),
          ),
      ),
    ).toBe('bar'); // Nested chart does not change parent
  });
});
