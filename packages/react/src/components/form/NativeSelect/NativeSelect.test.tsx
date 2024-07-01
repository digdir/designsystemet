import type { RefObject } from 'react';
import { createRef, act } from 'react';
import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { NativeSelectProps } from './NativeSelect';
import { NativeSelect } from './NativeSelect';

const user = userEvent.setup();

// Test data:
const options: { label: string; value: string }[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];
const children = options.map(({ label, value }) => (
  <option
    key={value}
    value={value}
  >
    {label}
  </option>
));
const defaultProps: NativeSelectProps = {
  children,
};

describe('NativeSelect', () => {
  it('Renders with given label', () => {
    const label = 'Test label';
    render({ label });
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it('Renders with given id', () => {
    const id = 'test-select-id';
    render({ id });
    expect(screen.getByRole('combobox')).toHaveAttribute('id', id);
  });

  test('has correct description', () => {
    render({ description: 'description' });
    expect(
      screen.getByRole('combobox', { description: 'description' }),
    ).toBeDefined();
  });

  test('has correct description and label when label is hidden', () => {
    render({ description: 'description', label: 'label', hideLabel: true });

    expect(screen.getByLabelText('label')).toBeDefined();
    expect(
      screen.getByRole('combobox', { description: 'description' }),
    ).toBeDefined();
  });

  it('Renders all options', () => {
    render();
    options.forEach(({ label, value }) => {
      expect(screen.getByRole('option', { name: label })).toHaveValue(value);
    });
  });

  it('Lets the user select a value', async () => {
    render();
    const select = screen.getByRole('combobox');
    const { value } = options[1];
    await act(async () => await user.selectOptions(select, value));
    expect(select).toHaveValue(value);
  });

  it('Calls "onChange" when the user selects a value', async () => {
    const onChange = vi.fn();
    render({ onChange });
    const { value } = options[1];
    await act(
      async () => await user.selectOptions(screen.getByRole('combobox'), value),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]?.target.value).toEqual(value); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
  });

  it('Is disabled when "disabled" is true', () => {
    render({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should be disabled when "readOnly" is true', () => {
    render({ readOnly: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('Sets the ref on the select element if given', () => {
    const ref = createRef<HTMLSelectElement>();
    render({}, ref);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('Appends the given className to the select element', () => {
    const className = 'test-class';
    render({ className });
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass(className);
  });
});

const render = (
  props?: Partial<NativeSelectProps>,
  ref?: RefObject<HTMLSelectElement>,
) =>
  renderRtl(
    <NativeSelect
      {...defaultProps}
      {...props}
      ref={ref}
    />,
  );
