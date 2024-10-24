import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  test('has correct value and label', () => {
    render(<Checkbox label='label' value='test' />);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render(<Checkbox label='test' value='test' description='description' />);
    expect(
      screen.getByRole('checkbox', { description: 'description' }),
    ).toBeDefined();
  });
  it('calls onChange and onClick when user clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    const value = 'test';

    render(
      <Checkbox
        label='label'
        value={value}
        onChange={onChange}
        onClick={onClick}
      />,
    );

    const radio = screen.getByRole<HTMLInputElement>('checkbox');

    expect(radio.checked).toBeFalsy();

    await act(async () => await user.click(radio));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(radio.checked).toBeTruthy();
  });

  it('does not call onChange or onClick when user clicks and the radio is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Checkbox
        label='disabled radio'
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      />,
    );

    const radio = screen.getByRole('checkbox');
    await act(async () => await user.click(radio));

    expect(radio).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when user clicks and the radio is readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox
        label='readonly radio'
        value='test'
        readOnly
        onChange={onChange}
      />,
    );

    const radio = screen.getByRole('checkbox');
    await act(async () => await user.click(radio));

    expect(radio).toHaveAttribute('readonly');
    expect(onChange).not.toHaveBeenCalled();
  });
});
