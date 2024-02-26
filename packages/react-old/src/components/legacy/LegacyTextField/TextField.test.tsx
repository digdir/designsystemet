import { render as renderRtl, screen } from '@testing-library/react';
import type * as React from 'react';
import userEvent from '@testing-library/user-event';

import type { LegacyTextFieldProps } from './TextField';
import { LegacyTextField } from './TextField';

const user = userEvent.setup();

describe('TextField', () => {
  describe('Default', () => {
    it('Triggers onPaste when pasting into input', async () => {
      const onPaste = jest.fn();
      const data = 'Hello world';
      render({ onPaste });
      const element = screen.getByRole('textbox');
      await user.click(element);
      await user.paste(data);
      expect(onPaste).toHaveBeenCalledTimes(1);
      expect(onPaste).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          clipboardData: expect.objectContaining({
            items: [expect.objectContaining({ data })],
          }),
        }),
      );
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
      const inputField = screen.getByLabelText('First name');
      await user.type(inputField, 'Peter');
      expect(screen.getByText('5 characters remaining')).toBeInTheDocument();
    });

    it('Triggers onBlur event when field loses focus', async () => {
      const onBlur = jest.fn();
      render({ onBlur });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('Triggers onChange event for each keystroke', async () => {
      const onChange = jest.fn();
      const data = 'test';
      render({ onChange });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.keyboard(data);
      expect(onChange).toHaveBeenCalledTimes(data.length);
    });

    it('Sets given id on input field', () => {
      const id = 'some-unique-id';
      render({ id });
      expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
    });

    it('Focuses on input field when label is clicked and id is not given', async () => {
      const label = 'Lorem ipsum';
      render({ label });
      await user.click(screen.getByText(label));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('Focuses on input field when label is clicked and id is given', async () => {
      const label = 'Lorem ipsum';
      render({ id: 'some-unique-id', label });
      await user.click(screen.getByText(label));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('Has type attribute set to "text" by default', () => {
      render();
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('Has given type attribute if set', () => {
      const type = 'tel';
      render({ type });
      expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
    });
  });

  describe('Number format', () => {
    it('Triggers onPaste when pasting into input', async () => {
      const onPaste = jest.fn();
      const data = '123456';
      render({
        onPaste,
        formatting: { number: { prefix: '$' } },
      });
      const element = screen.getByRole('textbox');
      await user.click(element);
      await user.paste(data);
      expect(onPaste).toHaveBeenCalledTimes(1);
      expect(onPaste).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          clipboardData: expect.objectContaining({
            items: [expect.objectContaining({ data })],
          }),
        }),
      );
    });

    it('Renders as a NumberFormat element if format.number is specified', () => {
      render({ isValid: true, formatting: { number: {} } });
      expect(screen.getByRole('textbox').inputMode).toBe('numeric');
    });

    it('Triggers onBlur event when field loses focus', async () => {
      const onBlur = jest.fn();
      render({ onBlur, formatting: { number: { prefix: '$' } } });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('Should trigger onChange for every keystroke, and the event value should not contain formatting', async () => {
      let lastValue;
      const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        lastValue = event.target.value;
      });
      render({
        onChange,
        formatting: { number: { prefix: '$', thousandSeparator: ' ' } },
      });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.keyboard('1234');
      expect(screen.getByDisplayValue('$1 234')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(4);
      expect(lastValue).toBe('1234');
    });

    it('Does not trigger onChange when component is rerendered', () => {
      const onChange = jest.fn();
      const { rerender } = render({
        onChange,
        value: '1234',
        formatting: { number: { prefix: '$', thousandSeparator: ' ' } },
      });
      expect(screen.getByDisplayValue('$1 234')).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
      rerender(
        <LegacyTextField
          onChange={onChange}
          value='12345'
          formatting={{ number: { prefix: '$', thousandSeparator: ' ' } }}
        />,
      );
      expect(screen.getByDisplayValue('$12 345')).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('Handles backspace', async () => {
      let lastValue;
      const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        lastValue = event.target.value;
      });
      render({
        onChange,
        value: '123',
        formatting: { number: { suffix: ' 000 NOK', thousandSeparator: ' ' } },
      });
      expect(screen.getByDisplayValue('123 000 NOK')).toBeInTheDocument();
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.keyboard('{Backspace}{Backspace}');
      expect(screen.getByDisplayValue('1 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(lastValue).toBe('1');
      await user.keyboard('{Backspace}');
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(lastValue).toBe('');
    });

    it('Handles negative numbers', async () => {
      let lastValue;
      const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        lastValue = event.target.value;
      });
      render({
        onChange,
        value: '',
        formatting: { number: { suffix: ' 000 NOK', thousandSeparator: ' ' } },
      });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.keyboard('-123');
      expect(screen.getByDisplayValue('-123 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(4);
      expect(lastValue).toBe('-123');
      await user.keyboard('-');
      expect(screen.getByDisplayValue('123 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(5);
      expect(lastValue).toBe('123');
    });

    it('Handles "-" in prefix', async () => {
      let lastValue;
      const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        lastValue = event.target.value;
      });
      render({
        onChange,
        value: '',
        formatting: { number: { prefix: '- 0 ' } },
      });
      const element = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      await user.keyboard('1{Backspace}');
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(lastValue).toBe('');
    });

    it('Handles zeros in suffix (v4 & v5 bug)', async () => {
      let lastValue;
      const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
        lastValue = event.target.value;
      });
      render({
        onChange,
        value: '123',
        formatting: { number: { suffix: ' 000 NOK', thousandSeparator: ' ' } },
      });
      expect(screen.getByDisplayValue('123 000 NOK')).toBeInTheDocument();
      const element: HTMLInputElement = screen.getByRole('textbox');
      await user.click(element);
      expect(element).toHaveFocus();
      element.setSelectionRange(2, 4); // Select '3 ' (v4 bug)
      await user.keyboard('5');
      expect(screen.getByDisplayValue('125 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(lastValue).toBe('125');

      element.setSelectionRange(8, 11); // Select 'NOK' (v5 bug)
      await user.keyboard('8'); // This is ignored, suffix cannot be changed
      expect(screen.getByDisplayValue('125 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(1);

      element.setSelectionRange(3, 3); // Selection after the last digit
      await user.keyboard('8');
      expect(screen.getByDisplayValue('1 258 000 NOK')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledTimes(2);

      expect(lastValue).toBe('1258');
    });

    it('Sets given id on input field', () => {
      const id = 'some-unique-id';
      render({ id, formatting: { number: {} } });
      expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
    });

    it('Focuses on input field when label is clicked and id is not given', async () => {
      const label = 'Lorem ipsum';
      render({ label, formatting: { number: {} } });
      await user.click(screen.getByText(label));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('Focuses on input field when label is clicked and id is given', async () => {
      const label = 'Lorem ipsum';
      render({ id: 'some-unique-id', label, formatting: { number: {} } });
      await user.click(screen.getByText(label));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });
});

const render = (props: Partial<LegacyTextFieldProps> = {}) => {
  const allProps = {
    onChange: jest.fn(),
    ...props,
  } as LegacyTextFieldProps;

  return renderRtl(<LegacyTextField {...allProps} />);
};
