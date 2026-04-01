import { render, screen } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  test('has correct value and label', () => {
    render(<Switch label='label' value='test' />);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render(<Switch label='test' value='test' description='description' />);
    expect(
      screen.getByRole('switch', { description: 'description' }),
    ).toBeDefined();
  });
  it('calls onChange and onClick when user clicks', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();

    const value = 'test';

    render(
      <Switch
        label='label'
        value={value}
        onChange={onChange}
        onClick={onClick}
      />,
    );

    const switch_ = screen.getByRole<HTMLInputElement>('switch');

    expect(switch_.checked).toBeFalsy();

    switch_.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(switch_.checked).toBeTruthy();
  });

  it('does not call onChange or onClick when user clicks and the Switch is disabled', () => {
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Switch
        label='disabled switch_'
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      />,
    );

    const switch_ = screen.getByRole('switch');
    switch_.click();

    expect(switch_).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when user clicks and the Switch is readOnly', () => {
    const onChange = vi.fn();

    render(
      <Switch
        aria-label='readonly'
        value='test'
        readOnly
        onChange={onChange}
      />,
    );

    const switch_ = screen.getByRole('switch');
    switch_.click();

    expect(switch_).toHaveAttribute('readonly');
    expect(onChange).not.toHaveBeenCalled();
  });
});
