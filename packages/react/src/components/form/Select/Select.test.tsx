import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RefObject } from 'react';
import { act, createRef } from 'react';

import { Select, type SelectProps } from './';

const user = userEvent.setup();

// Test data:
const options: { label: string; value: string }[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];
const children = options.map(({ label, value }) => (
  <Select.Option key={value} value={value}>
    {label}
  </Select.Option>
));
const defaultProps: SelectProps = {
  children,
};

describe('Select', () => {
  it('Renders with given id', () => {
    const id = 'test-select-id';
    render({ id });
    expect(screen.getByRole('combobox')).toHaveAttribute('id', id);
  });

  it('Renders all options', () => {
    render();
    for (const { label, value } of options) {
      expect(screen.getByRole('option', { name: label })).toHaveValue(value);
    }
  });

  it('Renders with optgroup', () => {
    render({
      children: <Select.Optgroup label='Group'>{children}</Select.Optgroup>,
    });
    const optgroup = screen.getByRole('group');
    expect(optgroup).toBeInTheDocument();
    expect(optgroup.children.length).toBe(options.length);
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
    expect(onChange.mock.calls[0]?.[0]?.target.value).toEqual(value);
  });

  it('Is disabled when "disabled" is true', () => {
    render({ disabled: true });
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
  props?: Partial<SelectProps>,
  ref?: RefObject<HTMLSelectElement>,
) => renderRtl(<Select {...defaultProps} {...props} ref={ref} />);
