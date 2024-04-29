import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { TextareaProps } from './Textarea';
import { Textarea } from './Textarea';

const user = userEvent.setup();

describe('Textarea', () => {
  test('has correct value and label', () => {
    render({ value: 'test', label: 'label' });
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct description', () => {
    render({ description: 'description' });
    expect(screen.getByRole('textbox', { description: 'description' })).toBeDefined();
  });

  test('has correct description and label when label is hidden', () => {
    render({ description: 'description', label: 'label', hideLabel: true });

    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByRole('textbox', { description: 'description' })).toBeDefined();
  });

  test('is invalid with correct error message', () => {
    render({ error: 'error-message' });

    const textarea = screen.getByRole('textbox', {
      description: 'error-message',
    });
    expect(textarea).toBeDefined();
    expect(textarea).toBeInvalid();
  });
  test('is invalid with correct error message from errorId', () => {
    renderRtl(
      <>
        <span id='my-error'>my error message</span>
        <Textarea
          errorId='my-error'
          error
        />
      </>,
    );

    const textarea = screen.getByRole('textbox', {
      description: 'my error message',
    });
    expect(textarea).toBeDefined();
    expect(textarea).toBeInvalid();
  });
  it('should have max allowed characters label for screen readers', () => {
    render({
      characterLimit: {
        maxCount: 10,
        srLabel: 'Max 10 characters is allowed',
        label: (count: number) => `${count} characters remaining`,
      },
    });
    const screenReaderText = screen.getByText('Max 10 characters is allowed');
    expect(screenReaderText).toBeInTheDocument();
  });

  it('should countdown remaining characters', async () => {
    const user = userEvent.setup();
    render({
      label: 'First name',
      characterLimit: {
        maxCount: 10,
        label: (count: number) => `${count} characters remaining`,
        srLabel: 'characters remaining',
      },
    });
    const textareaField = screen.getByLabelText('First name');
    await user.type(textareaField, 'Peter');
    expect(screen.getByText('5 characters remaining')).toBeInTheDocument();
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = vi.fn();
    render({ onBlur });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = vi.fn();
    const data = 'test';
    render({ onChange });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.keyboard(data);
    expect(onChange).toHaveBeenCalledTimes(data.length);
  });

  it('Sets given id on textarea field', () => {
    const id = 'some-unique-id';
    render({ id });
    expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
  });

  it('Focuses on textarea field when label is clicked and id is not given', async () => {
    const label = 'Lorem ipsum';
    render({ label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Focuses on textarea field when label is clicked and id is given', async () => {
    const label = 'Lorem ipsum';
    render({ id: 'some-unique-id', label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});

const render = (props: Partial<TextareaProps> = {}) =>
  renderRtl(
    <Textarea
      {...{
        onChange: vi.fn(),
        ...props,
      }}
    />,
  );
