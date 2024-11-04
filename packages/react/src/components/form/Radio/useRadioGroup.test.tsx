import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Fieldset, Radio, ValidationMessage, useRadioGroup } from '../..';
import type { UseRadioGroupProps } from '../..';

const RadioGroup = (args: UseRadioGroupProps) => {
  const { getRadioProps, validationMessageProps } = useRadioGroup(args);
  return (
    <Fieldset>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Radio label='Test 1' {...getRadioProps('test1')} />
      <Radio label='Test 2 ' {...getRadioProps('test2')} />
      <Radio label='Test 3' {...getRadioProps('test3')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

describe('RadioGroup', () => {
  test('has generated name for Radio children', () => {
    render(<RadioGroup />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toHaveAttribute('name');
    expect(radio2).toHaveAttribute('name');
    expect(radio3).toHaveAttribute('name');
  });
  test('has passed name to Radio children', (): void => {
    render(<RadioGroup name='my-name' />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toHaveAttribute('name', 'my-name');
    expect(radio2).toHaveAttribute('name', 'my-name');
    expect(radio3).toHaveAttribute('name', 'my-name');
  });
  test('has passed disabled to Radio children', (): void => {
    render(<RadioGroup disabled />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toHaveAttribute('disabled');
    expect(radio2).toHaveAttribute('disabled');
    expect(radio3).toHaveAttribute('disabled');
  });
  test('has passed readOnly to Radio children', (): void => {
    render(<RadioGroup readOnly />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toHaveAttribute('readonly');
    expect(radio2).toHaveAttribute('readonly');
    expect(radio3).toHaveAttribute('readonly');
  });
  test('has passed required to Radio children', (): void => {
    render(<RadioGroup required />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toHaveAttribute('required');
    expect(radio2).toHaveAttribute('required');
    expect(radio3).toHaveAttribute('required');
  });
  test('has passed aria-invalid to Radio children', (): void => {
    render(<RadioGroup error='message' />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    const error = screen.getByText('message');
    expect(radio1).toHaveAttribute('aria-invalid', 'true');
    expect(radio2).toHaveAttribute('aria-invalid', 'true');
    expect(radio3).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeVisible();
  });
  test('has correct Radio checked when value is used', () => {
    const { container } = render(<RadioGroup value='test1' />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });
  test('has passed clicked Radio element to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<RadioGroup onChange={onChangeMock} />);

    const radio1 = screen.getByLabelText('Test 1');
    const radio2 = screen.getByLabelText('Test 2');
    const radio3 = screen.getByLabelText('Test 3');

    await act(async () => await user.click(radio1));
    expect(onChangeMock).toHaveBeenCalledWith('test1', '', expect.any(Object));
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });
});
