import { render as renderRtl, screen } from '@testing-library/react';

import type { InputWrapperProps } from './InputWrapper';
import { InputWrapper } from './InputWrapper';
import type { InputVariant_ } from './utils';
import { inputVariants } from './utils';

describe('InputWrapper', () => {
  describe('Error icon', () => {
    it('Does not show error-icon when isValid is true', () => {
      render({ isValid: true });
      expect(screen.queryByTestId('input-icon-error')).not.toBeInTheDocument();
    });

    it('Does not show error-icon when isValid is true and readOnly is true', () => {
      render({ isValid: true, readOnly: true });
      expect(screen.queryByTestId('input-icon-error')).not.toBeInTheDocument();
    });

    it('Does not show error-icon when isValid is true and disabled is true', () => {
      render({ isValid: true, disabled: true });
      expect(screen.queryByTestId('input-icon-error')).not.toBeInTheDocument();
    });

    it('Shows error-icon when isValid is false', () => {
      render({ isValid: false });
      expect(screen.queryByTestId('input-icon-error')).toBeInTheDocument();
    });

    it('should not have aria-describedby when its not provided', () => {
      render({ label: 'Simple' });
      expect(screen.getByLabelText('Simple')).not.toHaveAttribute(
        'aria-describedby',
      );
    });

    it('should have aria-describedby when its provided', () => {
      render({
        label: 'Simple text-field',
        ariaDescribedBy: 'another-element-id',
      });
      expect(screen.getByLabelText('Simple text-field')).toHaveAttribute(
        'aria-describedby',
        'another-element-id',
      );
    });

    it('aria-describedby attribute should be derived from both the provided props and auto-generated based on the character limit', () => {
      render({
        label: 'Simple text-field',
        ariaDescribedBy: 'another-element-id',
        characterLimit: {
          maxCount: 100,
          srLabel: 'Max count',
          label: (count) => `Remaining ${count}`,
        },
      });
      const characterLimitId = ':rd:';
      expect(screen.getByLabelText('Simple text-field')).toHaveAttribute(
        'aria-describedby',
        `another-element-id ${characterLimitId}`,
      );
    });
  });

  describe('Search icon', () => {
    it('Does not show search-icon when isSearch is false', () => {
      render({ isSearch: false });
      expect(screen.queryByTestId('input-icon-search')).not.toBeInTheDocument();
    });

    it('Shows search-icon when isSearch is true', () => {
      render({ isSearch: true });
      expect(screen.queryByTestId('input-icon-search')).toBeInTheDocument();
    });

    it('Does not show search-icon when isValid is false', () => {
      render({ isValid: false });
      expect(screen.queryByTestId('input-icon-search')).not.toBeInTheDocument();
    });
  });

  describe('Input variant', () => {
    it('Renders with correct class when isValid is false and readOnly or disabled are not specified', () => {
      render({ isValid: false });
      const { expectedClassName, otherClassNames } = getClassNames('error');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with correct classname when isValid is true and readOnly or disabled is not specified', () => {
      render({ isValid: true });
      const { expectedClassName, otherClassNames } = getClassNames('default');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with correct classname when readOnly is true and disabled is not specified', () => {
      render({ readOnly: true });
      const { expectedClassName, otherClassNames } =
        getClassNames('readonlyInfo');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with correct classname when readOnly is <readonly-confirm> and disabled is not specified', () => {
      render({ readOnly: 'readonlyConfirm' });
      const { expectedClassName, otherClassNames } =
        getClassNames('readonlyConfirm');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with correct classname when readOnly is <readonly-info> and disabled is not specified', () => {
      render({ readOnly: 'readonlyInfo' });
      const { expectedClassName, otherClassNames } =
        getClassNames('readonlyInfo');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with correct classname when disabled is true', () => {
      render({ disabled: true });
      const { expectedClassName, otherClassNames } = getClassNames('disabled');
      const { classList } = getTextField();
      expect(classList).toContain(expectedClassName);
      otherClassNames.forEach((v) => {
        expect(classList).not.toContain(v);
      });
    });

    it('Renders with padding class by default', () => {
      render();
      const { classList } = getTextField();
      expect(classList).toContain('withPadding');
    });

    it('Renders without padding class when "noPadding" property is true', () => {
      render({ noPadding: true });
      const { classList } = getTextField();
      expect(classList).not.toContain('withPadding');
    });

    it('Calls inputRenderer with focus-effect class by default', () => {
      const inputRenderer = jest.fn();
      render({ inputRenderer });
      expect(inputRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          className: expect.stringContaining('focusable'), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        }),
      );
    });

    it('Calls inputRenderer without focus-effect class when "noFocusEffect" property is true', () => {
      const inputRenderer = jest.fn();
      render({ inputRenderer, noFocusEffect: true });
      expect(inputRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          className: expect.not.stringContaining('focusable'), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        }),
      );
    });

    it('Sets given id and class on the root element', () => {
      const id = 'some-unique-id';
      const className = 'some-class';
      const { container } = render({ id, className });
      expect(container.firstChild).toHaveAttribute('id', id);
      expect(container.firstChild).toHaveClass(className);
    });
  });

  describe('Label', () => {
    it('Shows label when label is set', () => {
      const label = 'Label is here';
      render({ label });
      expect(screen.queryByText(label)).toBeInTheDocument();
    });

    it('Does not show label when label is not set', () => {
      const { container } = render({ label: undefined });
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('Attaches label to input element when inputId is not set', () => {
      const label = 'Label is here';
      render({ label });
      expect(screen.getByLabelText(label)).toHaveAttribute('id');
    });

    it('Attaches label to input element when inputId is set', () => {
      const inputId = 'some-unique-id';
      const label = 'Label is here';
      render({ inputId, label });
      expect(screen.getByLabelText(label)).toHaveAttribute('id', inputId);
    });
  });

  describe('Character limit', () => {
    it('should support screen reader max-char description', () => {
      render({
        label: 'Other',
        characterLimit: {
          maxCount: 2,
          label: (count: number) => `${count} signs left`,
          srLabel: '2 signs allowed',
        },
      });
      expect(screen.getByLabelText('Other')).toHaveAttribute(
        'aria-describedby',
      );
      expect(screen.getByText('2 signs allowed')).toHaveAttribute('id');
    });

    it('should inform screen reader users when max char limit has been exceeded', () => {
      render({
        label: 'Comment',
        value: 'Hello',
        characterLimit: {
          maxCount: 2,
          label: (count: number) => `${count} signs left`,
          srLabel: '2 signs allowed',
        },
      });

      expect(screen.getByText('-3 signs left')).toHaveAttribute(
        'aria-live',
        'polite',
      );
    });

    it('should not have aria-describedby when character-limit is not provided ', () => {
      render({
        label: 'Other',
      });
      expect(screen.getByLabelText('Other')).not.toHaveAttribute(
        'aria-describedby',
      );
    });
  });
});

const getTextField = () => screen.getByTestId('InputWrapper');

const getClassNames = (expectedClassName: InputVariant_) => {
  const otherClassNames = inputVariants.filter((v) => v !== expectedClassName);
  return { expectedClassName, otherClassNames };
};

const render = (props: Partial<InputWrapperProps> = {}) => {
  const allProps: InputWrapperProps = {
    inputRenderer: ({ className, inputId, describedBy }) => (
      <input
        className={className}
        id={inputId}
        aria-describedby={describedBy}
      />
    ),
    ...props,
  };
  return renderRtl(<InputWrapper {...allProps} />);
};
