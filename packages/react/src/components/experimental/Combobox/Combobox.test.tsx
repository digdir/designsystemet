import type { RefObject } from 'react';
import React, { createRef } from 'react';
import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ComboboxProps } from './Combobox';
import { EXPERIMENTAL_Combobox } from './Combobox';
import { countries } from './test-data/countries';
import type { ComboboxFilter } from './types/ComboboxFilter';
import type { ComboboxOption } from './types/ComboboxOption';
import { getCountryName } from './test-data/getCountryName';

const user = userEvent.setup();

// Test data:
const placeholder = 'Enter a country';
const options = Object.keys(countries);
const optionLabel: ComboboxOption = (key: string) =>
  `${getCountryName(key)} (${key})`;
const defaultProps: ComboboxProps = {
  placeholder,
  options,
  optionLabel,
};

describe('Combobox', () => {
  afterEach(jest.clearAllMocks);

  it('Does not show the list when user has not typed anything', async () => {
    render();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Opens when user types something', async () => {
    render();
    const input = screen.getByRole('combobox');
    await user.type(input, 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Renders the values as labels by default', async () => {
    render({ optionLabel: undefined });
    const input = screen.getByRole('combobox');
    await user.type(input, 'n');
    const norwayOption = screen.getByRole('option', { name: /NO/i });
    expect(norwayOption).toBeInTheDocument();
  });

  it('Sets value correctly when something is selected', async () => {
    render();
    await user.type(screen.getByRole('combobox'), 'n');
    await user.click(screen.getByRole('option', { name: /Norge/i }));
    expect(screen.getByRole('combobox')).toHaveValue('NO');
  });

  it('Calls onChange and onSelect functions with new value when user selects an item with the mouse', async () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    render({ onChange, onSelect });
    await user.type(screen.getByRole('combobox'), 'f');
    await user.click(screen.getByRole('option', { name: /Frankrike/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'FR' }), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      }),
    );
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('FR');
  });

  it('Calls onChange and onSelect functions with new value when user selects an item with the keyboard', async () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    render({ onChange, onSelect });
    await user.type(screen.getByRole('combobox'), 'a');
    await user.type(screen.getByRole('combobox'), '{arrowdown}');
    await user.type(screen.getByRole('combobox'), '{arrowdown}');
    await user.type(screen.getByRole('combobox'), '{enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Renders with given selected value', () => {
    const value = 'PL';
    render({ value });
    expect(screen.getByRole('combobox')).toHaveValue(value);
  });

  it('Opens when the user presses the arrow down key', async () => {
    render();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.type(screen.getByRole('combobox'), '{arrowdown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Filters the countries using the given filter function', async () => {
    const testInput = 'a';
    const filter: ComboboxFilter = (input, options) =>
      input === testInput
        ? options.filter((option) => option === 'NO')
        : options; // Only show Norway if the user types the testInput value
    render({ filter });
    await user.type(screen.getByRole('combobox'), '{arrowdown}');
    expect(screen.queryAllByRole('option')).toHaveLength(options.length);
    await user.type(screen.getByRole('combobox'), testInput);
    expect(screen.getByRole('option', { name: /Norge/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(1);
  });

  it('Forwards the given ref', () => {
    const ref = createRef<HTMLInputElement>();
    render({}, ref);
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });
});

const render = (
  props: Partial<ComboboxProps> = {},
  ref?: RefObject<HTMLInputElement>,
) =>
  renderRtl(
    <EXPERIMENTAL_Combobox
      {...defaultProps}
      {...props}
      ref={ref}
    />,
  );
