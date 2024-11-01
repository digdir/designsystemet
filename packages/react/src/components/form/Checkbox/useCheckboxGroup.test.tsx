import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Checkbox, Fieldset, ValidationMessage, useCheckboxGroup } from '../..';
import type { UseCheckboxGroupProps } from '../..';

const CheckboxGroup = (args: UseCheckboxGroupProps) => {
  const { getCheckboxProps, getIndeterminateProps, validationMessageProps } =
    useCheckboxGroup(args);
  return (
    <Fieldset>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Checkbox aria-label='All' {...getIndeterminateProps()} />
      <Checkbox label='Test' {...getCheckboxProps('test')} />
      <Checkbox label='Fest' {...getCheckboxProps('fest')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

describe('CheckboxGroup', () => {
  test('has generated name for Checkbox children', () => {
    render(<CheckboxGroup />);

    const checkbox = screen.getByLabelText('Test');
    expect(checkbox).toHaveAttribute('name');
  });
  test('has passed name to Checkbox children', (): void => {
    render(<CheckboxGroup name='my-name' />);

    const checkbox = screen.getByLabelText('Test');
    expect(checkbox).toHaveAttribute('name', 'my-name');
  });
  test('has passed disabled to Checkbox children', (): void => {
    render(<CheckboxGroup disabled />);

    const checkbox = screen.getByLabelText('Test');
    expect(checkbox).toHaveAttribute('disabled');
  });
  test('has passed readOnly to Checkbox children', (): void => {
    render(<CheckboxGroup readOnly />);

    const checkbox = screen.getByLabelText('Test');
    expect(checkbox).toHaveAttribute('readonly');
  });
  test('has passed aria-invalid to Checkbox children', (): void => {
    render(<CheckboxGroup error='message' />);

    const checkbox = screen.getByLabelText('Test');
    const error = screen.getByText('message');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeVisible();
  });
  test('has correct Checkbox checked when value is used', () => {
    const { container } = render(<CheckboxGroup value={['test']} />);

    console.log(container.innerHTML);

    const checkbox = screen.getByLabelText('Test');
    expect(checkbox).toBeChecked();
  });
  test('has passed clicked Checkbox element to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<CheckboxGroup onChange={onChangeMock} />);

    const checkbox = screen.getByLabelText('Test');

    await act(async () => await user.click(checkbox));

    expect(onChangeMock).toHaveBeenCalledWith(['test'], [], expect.any(Object));
    expect(checkbox).toBeChecked();
  });
  test('correctly renders indeterminate', async () => {
    render(<CheckboxGroup />);

    const indeterminate = screen.getByLabelText('All');
    const checkbox1 = screen.getByLabelText('Test');
    const checkbox2 = screen.getByLabelText('Fest');
    const user = userEvent.setup();

    // Shoud be neither checked or indeterminate initially
    expect(indeterminate).toHaveProperty('indeterminate', false);
    expect(indeterminate).toHaveProperty('checked', false);
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).not.toBeChecked();

    // Should be indeterminate when first checkbox is checked
    await act(async () => await user.click(checkbox1));
    expect(indeterminate).toHaveProperty('indeterminate', true);
    expect(indeterminate).toHaveProperty('checked', false);
    expect(checkbox1).toBeChecked();
    expect(checkbox2).not.toBeChecked();

    // Should be checked when both checkboxes are checked
    await act(async () => await user.click(checkbox2));
    expect(indeterminate).toHaveProperty('indeterminate', false);
    expect(indeterminate).toHaveProperty('checked', true);
    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();

    // Should uncheck all when clicking the main checkbox
    await act(async () => await user.click(indeterminate));
    expect(indeterminate).toHaveProperty('indeterminate', false);
    expect(indeterminate).toHaveProperty('checked', false);
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).not.toBeChecked();

    // Should check all when clicking the main checkbox again
    await act(async () => await user.click(indeterminate));
    expect(indeterminate).toHaveProperty('indeterminate', false);
    expect(indeterminate).toHaveProperty('checked', true);
    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeChecked();
  });
});
