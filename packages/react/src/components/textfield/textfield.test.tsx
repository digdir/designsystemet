import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { TextfieldProps } from './Textfield';
import { Textfield } from './Textfield';

const user = userEvent.setup();

describe('Textfield', () => {
  it('has correct value and label', () => {
    render({ value: 'test', label: 'label' });
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  it('has correct description', () => {
    render({ description: 'description', 'aria-label': 'label' });
    expect(
      screen.getByRole('textbox', { description: 'description' }),
    ).toBeDefined();
  });

  it('should become a textarea when multiline is true', () => {
    render({ multiline: true, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('is invalid with correct error message', () => {
    render({ error: 'error-message', 'aria-label': 'label' });

    const input = screen.getByRole('textbox', { description: 'error-message' });
    expect(input).toBeDefined();
    expect(input).toBeInvalid();
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = vi.fn();
    render({ onBlur, 'aria-label': 'label' });
    const element = screen.getByRole('textbox');
    await act(async () => await user.click(element));
    expect(element).toHaveFocus();
    await act(async () => await user.tab());
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = vi.fn();
    const data = 'test';
    render({ onChange, 'aria-label': 'label' });
    const element = screen.getByRole('textbox');
    await act(async () => await user.click(element));
    expect(element).toHaveFocus();
    await act(async () => await user.keyboard(data));
    expect(onChange).toHaveBeenCalledTimes(data.length);
  });

  it('Sets given id on input field', () => {
    const id = 'some-unique-id';
    render({ id, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
  });

  it('Focuses on input field when label is clicked and id is not given', async () => {
    const label = 'Lorem ipsum';
    render({ label });
    await act(async () => await user.click(screen.getByText(label)));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Focuses on input field when label is clicked and id is given', async () => {
    const label = 'Lorem ipsum';
    render({ id: 'some-unique-id', label });
    await act(async () => await user.click(screen.getByText(label)));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Has type attribute set to "text" by default', () => {
    render();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('Has given type attribute if set', () => {
    const type = 'tel';
    render({ type, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
  });
});

const render = (
  props: TextfieldProps = {
    'aria-label': 'label',
  },
) =>
  renderRtl(
    <Textfield
      {...{
        onChange: vi.fn(),
        ...props,
      }}
    />,
  );
