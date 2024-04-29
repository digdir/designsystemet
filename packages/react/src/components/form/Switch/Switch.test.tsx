import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './Switch';

describe('Switch', () => {
  test('has correct value and label', () => {
    render(<Switch value='test'>label</Switch>);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render(
      <Switch
        value='test'
        description='description'
      >
        test
      </Switch>,
    );
    expect(screen.getByRole('checkbox', { description: 'description' })).toBeDefined();
  });
  it('calls onChange and onClick when user clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    const value = 'test';

    render(
      <Switch
        value={value}
        onChange={onChange}
        onClick={onClick}
      >
        label
      </Switch>,
    );

    const switch_ = screen.getByRole<HTMLInputElement>('checkbox');

    expect(switch_.checked).toBeFalsy();

    await user.click(switch_);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(switch_.checked).toBeTruthy();
  });

  it('does not call onChange or onClick when user clicks and the Switch is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Switch
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      >
        disabled switch_
      </Switch>,
    );

    const switch_ = screen.getByRole('checkbox');
    await user.click(switch_);

    expect(switch_).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange or onClick when user clicks and the Switch is readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();

    render(
      <Switch
        value='test'
        readOnly
        onClick={onClick}
        onChange={onChange}
      >
        readonly switch_
      </Switch>,
    );

    const switch_ = screen.getByRole('checkbox');
    await user.click(switch_);

    expect(switch_).toHaveAttribute('readonly');
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  //TODO is there a good way to test size?
});
