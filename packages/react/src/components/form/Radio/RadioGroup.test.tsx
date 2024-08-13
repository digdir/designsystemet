import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Radio } from '.';

import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  test('has generated name for Radio children', () => {
    render(
      <RadioGroup legend='Radio group legend'>
        <Radio value='test'>test</Radio>
      </RadioGroup>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name');
  });
  test('has passed name to Radio children', (): void => {
    render(
      <RadioGroup legend='Radio group legend' name='my name'>
        <Radio value='test'>test</Radio>
      </RadioGroup>,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');
    expect(radio.name).toEqual('my name');
  });
  test('has passed required to Radio children', (): void => {
    render(
      <RadioGroup legend='Radio group legend' required>
        <Radio value='test'>test</Radio>
      </RadioGroup>,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');
    expect(radio).toHaveAttribute('required');
  });
  test('has correct Radio defaultChecked & checked when defaultValue is used', () => {
    render(
      <RadioGroup legend='Radio group legend' defaultValue='test2'>
        <Radio value='test1'>test1</Radio>
        <Radio value='test2'>test2</Radio>
        <Radio value='test3'>test3</Radio>
      </RadioGroup>,
    );

    const radio = screen.getByDisplayValue<HTMLInputElement>('test2');
    expect(radio.defaultChecked).toBeTruthy();
    expect(radio.checked).toBeTruthy();
  });
  test('has passed clicked Radio element to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <RadioGroup legend='Radio group legend' onChange={onChangeMock}>
        <Radio value='test1'>test1</Radio>
        <Radio value='test2'>test2</Radio>
        <Radio value='test3'>test3</Radio>
      </RadioGroup>,
    );

    const radio = screen.getByDisplayValue<HTMLInputElement>('test2');

    await act(async () => await user.click(radio));

    expect(onChangeMock).toHaveBeenCalledWith('test2');
    expect(radio.checked).toBeTruthy();
  });
});
