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
      <Radio label='Test' {...getRadioProps('test')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

describe('RadioGroup', () => {
  test('has generated name for Radio children', () => {
    render(<RadioGroup />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name');
  });
  test('has passed name to Radio children', (): void => {
    render(<RadioGroup name='my-name' />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'my-name');
  });
  test('has passed disabled to Radio children', (): void => {
    render(<RadioGroup disabled />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('disabled');
  });
  test('has passed readOnly to Radio children', (): void => {
    render(<RadioGroup readOnly />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('readonly');
  });
  test('has passed aria-invalid to Radio children', (): void => {
    render(<RadioGroup error='message' />);

    const radio = screen.getByRole('radio');
    const error = screen.getByText('message');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeVisible();
  });
  test('has correct Radio checked when value is used', () => {
    const { container } = render(<RadioGroup value='test' />);

    const radio = screen.getByLabelText('Test');
    expect(radio).toBeChecked();
  });
  test('has passed clicked Radio element to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<RadioGroup onChange={onChangeMock} />);

    const radio = screen.getByLabelText('Test');

    await act(async () => await user.click(radio));

    expect(onChangeMock).toHaveBeenCalledWith('test', '', expect.any(Object));
    expect(radio).toBeChecked();
  });
});
