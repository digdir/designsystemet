import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  test('has correct value and label', () => {
    render(<Checkbox value='test'>label</Checkbox>);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render(
      <Checkbox
        value='test'
        description='description'
      >
        test
      </Checkbox>,
    );
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
        value={value}
        onChange={onChange}
        onClick={onClick}
      >
        label
      </Checkbox>,
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
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      >
        disabled radio
      </Checkbox>,
    );

    const radio = screen.getByRole('checkbox');
    await act(async () => await user.click(radio));

    expect(radio).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange or onClick when user clicks and the radio is readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Checkbox
        value='test'
        readOnly
        onClick={onClick}
        onChange={onChange}
      >
        readonly radio
      </Checkbox>,
    );

    const radio = screen.getByRole('checkbox');
    await act(async () => await user.click(radio));

    expect(radio).toHaveAttribute('readonly');
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  //TODO is there a good way to test size?
});
