import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '..';

import { CheckboxGroup } from './Group';

describe('CheckboxGroup', () => {
  test('has correct Checkbox defaultChecked & checked when defaultValue is used', () => {
    render(
      <CheckboxGroup
        legend='CheckboxGroup'
        defaultValue={['test2']}
      >
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
      <CheckboxGroup
        legend='CheckboxGroup'
        onChange={(value) => (onChangeValue = value)}
      >
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(checkbox2);

    expect(onChangeValue).toContain('test2');
    expect(onChangeValue).toHaveLength(1);
    expect(checkbox2).toBeChecked();
  });

  test('has removed clicked Checkbox in value passed to onChange', async () => {
    const user = userEvent.setup();
    let onChangeValue: string[] = [];

    render(
      <CheckboxGroup
        legend='CheckboxGroup'
        onChange={(value) => (onChangeValue = value)}
      >
        <Checkbox value='test1'>test1</Checkbox>
        <Checkbox value='test2'>test2</Checkbox>
        <Checkbox value='test3'>test3</Checkbox>
      </CheckboxGroup>,
    );

    const checkbox2 = screen.getByDisplayValue<HTMLInputElement>('test2');

    await user.click(checkbox2);

    expect(onChangeValue).toContain('test2');
    expect(onChangeValue).toHaveLength(1);
    expect(checkbox2).toBeChecked();

    await user.click(checkbox2);

    expect(onChangeValue).toHaveLength(0);
    expect(checkbox2).not.toBeChecked();
  });
});
