import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Radio } from './Radio';

describe('Radio', () => {
  test('has correct value and label', (): void => {
    render(<Radio value='test'>label</Radio>);
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', (): void => {
    render(
      <Radio
        value='test'
        description='description'
      >
        test
      </Radio>,
    );
    expect(
      screen.getByRole('radio', { description: 'description' }),
    ).toBeDefined();
  });
  it('calls onChange and onClick when user clicks', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onClick = jest.fn();

    const value = 'test';

    render(
      <Radio
        value={value}
        onChange={onChange}
        onClick={onClick}
      >
        label
      </Radio>,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');

    expect(radio.checked).toBeFalsy();

    await user.click(radio);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(radio.checked).toBeTruthy();
  });

  it('does not call onChange or onClick when user clicks and the radio is disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onClick = jest.fn();

    render(
      <Radio
        value='test'
        disabled
        onClick={onClick}
        onChange={onChange}
      >
        disabled radio
      </Radio>,
    );

    const radio = screen.getByRole('radio');
    await user.click(radio);

    expect(radio).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange or onClick when user clicks and the radio is readOnly', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onClick = jest.fn();

    render(
      <Radio
        value='test'
        readOnly
        onClick={onClick}
        onChange={onChange}
      >
        readonly radio
      </Radio>,
    );

    const radio = screen.getByRole('radio');
    await user.click(radio);

    expect(radio).toHaveAttribute('readonly');
    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  //TODO is there a good way to test size?
});
