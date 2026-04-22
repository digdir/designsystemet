import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Select, type SelectProps } from './';

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
const _defaultProps: SelectProps = {
  children,
};

describe('Select', () => {
  // it('Renders with given label', () => {
  //   const label = 'Test label';
  //   render({ label });
  //   expect(screen.getByLabelText(label)).toBeInTheDocument();
  // });

  it('Renders with given id', () => {
    const id = 'test-select-id';
    render(<Select id={id} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', id);
  });

  // test('has correct description', () => {
  //   render({ description: 'description' });
  //   expect(
  //     screen.getByRole('combobox', { description: 'description' }),
  //   ).toBeDefined();
  // });

  // test('has correct description and label when label is hidden', () => {
  //   render({ description: 'description', label: 'label', hideLabel: true });

  //   expect(screen.getByLabelText('label')).toBeDefined();
  //   expect(
  //     screen.getByRole('combobox', { description: 'description' }),
  //   ).toBeDefined();
  // });

  it('Renders all options', () => {
    render(<Select>{children}</Select>);
    for (const { label, value } of options) {
      expect(screen.getByRole('option', { name: label })).toHaveValue(value);
    }
  });

  it('Renders with optgroup', () => {
    render(
      <Select>
        <Select.Optgroup label='Group'>{children}</Select.Optgroup>
      </Select>,
    );
    const optgroup = screen.getByRole('group');
    expect(optgroup).toBeInTheDocument();
    expect(optgroup.children.length).toBe(options.length);
  });

  // TODO EIRIK: Commented out because this is testing if HTML works
  // it('Lets the user select a value', () => {
  //   render();
  //   const select = screen.getByRole('combobox');
  //   const { value } = options[1];
  //   await user.selectOptions(select, value);
  //   expect(select).toHaveValue(value);
  // });

  // it('Calls "onChange" when the user selects a value', () => {
  //   const onChange = vi.fn();
  //   render({ onChange });
  //   const { value } = options[1];
  //   await user.selectOptions(screen.getByRole('combobox'), value)
  //   expect(onChange).toHaveBeenCalledTimes(1);
  //   expect(onChange.mock.calls[0]?.[0]?.target.value).toEqual(value);
  // });

  it('Is disabled when "disabled" is true', () => {
    render(<Select disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('Is read-only when "aria-readonly" is true', async () => {
    const onChange = vi.fn();

    render(
      <Select onChange={onChange} aria-readonly='true'>
        {children}
      </Select>,
    );

    const select = screen.getByRole('combobox');
    await act(async () => select.click());
    expect(select).toHaveFocus();

    const down = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const enter = new KeyboardEvent('keydown', { key: 'Enter' });
    await act(async () => select.dispatchEvent(down));
    await act(async () => select.dispatchEvent(enter));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-readonly',
      'true',
    );
  });

  it('Sets the ref on the select element if given', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('Appends the given className to the select element', () => {
    const className = 'test-class';
    render(<Select className={className} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass(className);
  });
});
