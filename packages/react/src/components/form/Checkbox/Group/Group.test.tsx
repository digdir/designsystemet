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
  test('has added clicked Checkbox in value passed to onChange', async () => {
    const user = userEvent.setup();
    let onChangeValue: string[] = [];

    render(
      <CheckboxGroup onChange={(value) => (onChangeValue = value)}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(checkbox2);

    expect(onChangeValue.includes('test2')).toBeTruthy();
    expect(onChangeValue.length === 1).toBeTruthy();
    expect(checkbox2.checked).toBeTruthy();
  });

  test('has removed clicked Checkbox in value passed to onChange', async () => {
    const user = userEvent.setup();
    let onChangeValue: string[] = [];

    render(
      <CheckboxGroup onChange={(value) => (onChangeValue = value)}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(checkbox2);

    expect(onChangeValue.includes('test2')).toBeTruthy();
    expect(onChangeValue.length === 1).toBeTruthy();
    expect(checkbox2.checked).toBeTruthy();

    await user.click(checkbox2);

    expect(onChangeValue.length === 0).toBeTruthy();
    expect(checkbox2.checked).toBeFalsy();
  });
});
