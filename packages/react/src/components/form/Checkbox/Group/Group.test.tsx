import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Checkbox } from '..';

import { CheckboxGroup } from './Group';

describe('CheckboxGroup', () => {
  test('has correct Checkbox defaultChecked & checked when defaultValue is used', () => {
    render(
      <CheckboxGroup legend='CheckboxGroup' defaultValue={['test2']}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox = screen.getByDisplayValue<HTMLInputElement>('test2');
    expect(checkbox.defaultChecked).toBeTruthy();
    expect(checkbox.checked).toBeTruthy();
  });
  test('has added clicked Checkbox in value passed to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <CheckboxGroup legend='CheckboxGroup' onChange={onChangeMock}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await act(async () => await user.click(checkbox2));

    expect(onChangeMock).toHaveBeenCalledWith(['test2']);
    expect(checkbox2).toBeChecked();
  });

  test('has removed clicked Checkbox in value passed to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <CheckboxGroup legend='CheckboxGroup' onChange={onChangeMock}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await act(async () => await user.click(checkbox2));

    expect(onChangeMock).toHaveBeenCalledWith(['test2']);
    expect(checkbox2).toBeChecked();

    await act(async () => await user.click(checkbox2));

    expect(onChangeMock).toHaveBeenCalledWith([]);
    expect(checkbox2).not.toBeChecked();
  });
});
