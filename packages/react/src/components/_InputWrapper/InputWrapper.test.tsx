import { render as renderRtl, screen } from '@testing-library/react';
import React from 'react';

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

    it('Renders with focus-effect class by default', () => {
      render();
      const { classList } = screen.getByTestId('InputWrapper');
      expect(classList).toContain('withFocusEffect');
    });

    it('Renders without focus-effect class when "noFocusEffect" property is true', () => {
      render({ noFocusEffect: true });
      const { classList } = screen.getByTestId('InputWrapper');
      expect(classList).not.toContain('withFocusEffect');
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
});

const getTextField = () => screen.getByTestId('InputWrapper');

const getClassNames = (expectedClassName: InputVariant_) => {
  const otherClassNames = inputVariants.filter((v) => v !== expectedClassName);
  return { expectedClassName, otherClassNames };
};

const render = (props: Partial<InputWrapperProps> = {}) => {
  const allProps: InputWrapperProps = {
    inputRenderer: ({ className, inputId }) => (
      <input
        className={className}
        id={inputId}
      />
    ),
    ...props,
  };
  return renderRtl(<InputWrapper {...allProps} />);
};
