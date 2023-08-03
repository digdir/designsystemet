import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '..';

import { CheckboxGroup } from './Group';

describe('CheckboxGroup', () => {
  test('has correct Checkbox defaultChecked & checked when defaultValue is used', () => {
    render(
      <CheckboxGroup defaultValue={['test2']}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox = screen.getByDisplayValue<HTMLInputElement>('test2');
    expect(checkbox.defaultChecked).toBeTruthy();
    expect(checkbox.checked).toBeTruthy();
  });
  test('has passed clicked Checkbox element to onChange', async () => {
    const user = userEvent.setup();
    let onChangeValue = '';

    render(
      <CheckboxGroup onChange={(e) => (onChangeValue = e.currentTarget.value)}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(checkbox);

    expect(onChangeValue).toEqual('test2');
    expect(checkbox.checked).toBeTruthy();
  });
});
