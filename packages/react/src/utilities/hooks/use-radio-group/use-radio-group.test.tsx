import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import {
  Button,
  Fieldset,
  Radio,
  ValidationMessage,
} from '../../../components';
import {
  type GetRadioProps,
  type UseRadioGroupProps,
  useRadioGroup,
} from './use-radio-group';

const RadioGroup = (args: UseRadioGroupProps) => {
  const { getRadioProps, validationMessageProps } = useRadioGroup(args);
  return (
    <Fieldset>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Radio label='Test 1' {...getRadioProps('test1')} />
      <Radio label='Test 2' {...getRadioProps('test2')} />
      <Radio label='Test 3' {...getRadioProps('test3')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

const RadioGroupRadio = (args: GetRadioProps) => {
  const { getRadioProps, validationMessageProps } = useRadioGroup();
  return (
    <Fieldset>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Radio label='Test 1' {...getRadioProps(args)} />
      <Radio label='Test 2' {...getRadioProps('test2')} />
      <ValidationMessage {...validationMessageProps} />
    </Fieldset>
  );
};

const ConditionalRadioGroup = (args: UseRadioGroupProps) => {
  const { getRadioProps } = useRadioGroup({
    name: 'test',
    ...args,
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      {open ? (
        <Fieldset>
          <Radio label='Test 1' {...getRadioProps('test1')} />
          <Radio label='Test 2' {...getRadioProps('test2')} />
        </Fieldset>
      ) : null}
    </>
  );
};

describe('RadioGroup', () => {
  test('has generated name for Radio children', async () => {
    render(<RadioGroup />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toHaveAttribute('name');
    expect(radio2).toHaveAttribute('name');
    expect(radio3).toHaveAttribute('name');
  });
  test('has passed name to Radio children', async () => {
    render(<RadioGroup name='my-name' />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toHaveAttribute('name', 'my-name');
    expect(radio2).toHaveAttribute('name', 'my-name');
    expect(radio3).toHaveAttribute('name', 'my-name');
  });
  test('has passed disabled to Radio children', async () => {
    render(<RadioGroup disabled />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toHaveAttribute('disabled');
    expect(radio2).toHaveAttribute('disabled');
    expect(radio3).toHaveAttribute('disabled');
  });
  test('has passed readOnly to Radio children', async () => {
    render(<RadioGroup readOnly />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toHaveAttribute('readonly');
    expect(radio2).toHaveAttribute('readonly');
    expect(radio3).toHaveAttribute('readonly');
  });
  test('has passed required to Radio children', async () => {
    render(<RadioGroup required />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toHaveAttribute('required');
    expect(radio2).toHaveAttribute('required');
    expect(radio3).toHaveAttribute('required');
  });
  test('has passed aria-invalid to Radio children', async () => {
    render(<RadioGroup error='message' />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    const error = screen.getByText('message');
    expect(radio1).toHaveAttribute('aria-invalid', 'true');
    expect(radio2).toHaveAttribute('aria-invalid', 'true');
    expect(radio3).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeVisible();
  });
  test('has correct Radio checked when value is used', async () => {
    render(<RadioGroup value='test1' />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });
  test('has passed clicked Radio element to onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<RadioGroup onChange={onChangeMock} />);

    const radio1 = await screen.findByLabelText('Test 1');
    const radio2 = await screen.findByLabelText('Test 2');
    const radio3 = await screen.findByLabelText('Test 3');

    await user.click(radio1);
    expect(onChangeMock).toHaveBeenCalledWith('test1', '');
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  // TODO: ds-field web component overwrites aria-describedby, needs fix to merge existing values
  test.skip('correctly merges passed props with generated props', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();
    const customAriaDescribedBy = 'custom aria-describedby';

    render(
      <RadioGroupRadio
        value='test1'
        onChange={onChangeMock}
        aria-describedby={customAriaDescribedBy}
      />,
    );

    const radio1 = await screen.findByLabelText('Test 1');
    await user.click(radio1);

    expect(onChangeMock).toHaveBeenCalledOnce();
    expect(radio1).toBeChecked();

    expect(radio1).toHaveAttribute('aria-describedby', customAriaDescribedBy);
  });

  test('can be conditionally rendered', async () => {
    const user = userEvent.setup();
    render(<ConditionalRadioGroup />);

    /* click button to show radio buttons */
    const button = screen.getByRole('button', { name: 'Toggle' });
    await user.click(button);
    expect(await screen.findByLabelText('Test 1')).toBeVisible();
    expect(await screen.findByLabelText('Test 2')).toBeVisible();
  });
});
