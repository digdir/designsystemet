import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Radio } from './Radio';

describe('Radio', () => {
  test('has correct value and label', () => {
    render(<Radio label='label' value='test' />);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render(<Radio label='test' value='test' description='description' />);
    expect(
      screen.getByRole('radio', { description: 'description' }),
    ).toBeDefined();
  });

  test('should pass down name attribute to input', () => {
    render(<Radio label='label' value='test' name='radio-group123' />);
    expect(screen.getByRole('radio', { name: 'label' })).toHaveAttribute(
      'name',
      'radio-group123',
    );
  });

  test('has correct label when using aria-label', () => {
    render(<Radio value='test' aria-label='label' />);
    expect(screen.getByRole('radio', { name: 'label' })).toBeVisible();
  });

  test('has correct label when using aria-labelledby', () => {
    render(
      <div>
        <div id='label-id'>label outside radio</div>
        <Radio value='test' aria-labelledby='label-id' />
      </div>,
    );
    expect(
      screen.getByRole('radio', { name: 'label outside radio' }),
    ).toBeVisible();
  });

  it('calls onChange and onClick when user clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    const value = 'test';

    render(
      <Radio
        label='label'
        value={value}
        onChange={onChange}
        onClick={onClick}
      />,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');

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
      <Radio
        label='disabled radio'
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      />,
    );

    const radio = screen.getByRole('radio');
    await act(async () => await user.click(radio));

    expect(radio).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when user clicks and the radio is readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Radio
        label='readonly radio'
        value='test'
        readOnly
        onClick={onClick}
        onChange={onChange}
      />,
    );

    const radio = screen.getByRole('radio');
    await act(async () => await user.click(radio));

    expect(radio).toHaveAttribute('readonly');
    expect(onChange).not.toHaveBeenCalled();
  });
});
