import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '..';

import { CheckboxGroup } from './Group';

describe('RadioGroup', () => {
  test('has generated name for Radio children', () => {
    render(
      <CheckboxGroup>
        <Checkbox value='test'>test</Checkbox>
      </CheckboxGroup>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name');
  });
  test('has passed name to Radio children', (): void => {
    render(
      <CheckboxGroup name='my name'>
        <Checkbox value='test'>test</Checkbox>
      </CheckboxGroup>,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');
    expect(radio.name).toEqual('my name');
  });
  test('has passed required to Radio children', (): void => {
    render(
      <CheckboxGroup required>
        <Checkbox value='test'>test</Checkbox>
      </CheckboxGroup>,
    );

    const radio = screen.getByRole<HTMLInputElement>('radio');
    expect(radio).toHaveAttribute('required');
  });
  test('has correct Radio defaultChecked & checked when defaultValue is used', () => {
    render(
      <CheckboxGroup defaultValue='test2'>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const radio = screen.getByDisplayValue<HTMLInputElement>('test2');
    expect(radio.defaultChecked).toBeTruthy();
    expect(radio.checked).toBeTruthy();
  });
  test('has passed clicked Radio element to onChange', async () => {
    const user = userEvent.setup();
    let onChangeValue = '';

    render(
      <CheckboxGroup onChange={(e) => (onChangeValue = e.currentTarget.value)}>
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const radio = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(radio);

    expect(onChangeValue).toEqual('test2');
    expect(radio.checked).toBeTruthy();
  });
});
