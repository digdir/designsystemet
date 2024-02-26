import { createRef } from 'react';
import type { RefObject } from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { LegacyFieldSetProps } from './FieldSet';
import { LegacyFieldSet } from './FieldSet';

const defaultProps: LegacyFieldSetProps = {
  children: 'Some content.',
};

describe('FieldSet', () => {
  it('Should display children', () => {
    render();
    expect(screen.getByText(defaultProps.children as string)).toBeDefined();
  });

  it('Does not display legend by default', () => {
    const { container } = render();
    expect(container.querySelector('legend')).toBeFalsy();
  });

  it('Displays legend if given', () => {
    const legend = 'Lorem ipsum';
    const { container } = render({ legend });
    expect(container.querySelector('legend')).toHaveTextContent(legend);
  });

  it('Does not display description by default', () => {
    const { container } = render();
    expect(container.querySelector('.description')).toBeFalsy();
  });

  it('Displays description if given', () => {
    const description = 'Lorem ipsum dolor sit amet.';
    const { container } = render({ description });
    expect(container.querySelector('.description')).toHaveTextContent(
      description,
    );
  });

  it('Does not display error message by default', () => {
    render();
    expect(screen.queryAllByRole('alertdialog')).toHaveLength(0);
  });

  it('Displays error message if given', () => {
    const error = 'Something is wrong.';
    render({ error });
    expect(screen.getByRole('alert')).toHaveTextContent(error);
  });

  it('Has class "small" by default', () => {
    render();
    expect(screen.getByRole('group')).toHaveClass('small');
    expect(screen.getByRole('group')).not.toHaveClass('xsmall');
  });

  it('Has class "small" if the "size" property is set to "small"', () => {
    render({ size: 'small' });
    expect(screen.getByRole('group')).toHaveClass('small');
    expect(screen.getByRole('group')).not.toHaveClass('xsmall');
  });

  it('Has class "xsmall" if the "size" property is set to "xsmall"', () => {
    render({ size: 'xsmall' });
    expect(screen.getByRole('group')).toHaveClass('xsmall');
    expect(screen.getByRole('group')).not.toHaveClass('small');
  });

  it('Is enabled by default', () => {
    render();
    expect(screen.getByRole('group')).toBeEnabled();
  });

  it('Is disabled if the "disabled" property is true', () => {
    render({ disabled: true });
    expect(screen.getByRole('group')).toBeDisabled();
  });

  it('Is enabled if the "disabled" property is false', () => {
    render({ disabled: false });
    expect(screen.getByRole('group')).toBeEnabled();
  });

  it('Sets class given by the "contentClassName" property on the content div', () => {
    const contentClassName = 'some-class';
    const { container } = render({ contentClassName });
    expect(container.querySelector(`.${contentClassName}`)).toBeInTheDocument();
  });

  it('Displays legend and description if they are React nodes', () => {
    const legendText = 'Legend';
    const descriptionText = 'Description';
    render({
      legend: <span>{legendText}</span>,
      description: <span>{descriptionText}</span>,
    });
    expect(screen.getByText(legendText)).toBeInTheDocument();
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('Sets the ref on the fieldset element if given', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render({}, ref);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });
});

const render = (
  props: Partial<LegacyFieldSetProps> = {},
  ref?: RefObject<HTMLFieldSetElement>,
) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(
    <LegacyFieldSet
      {...allProps}
      ref={ref}
    >
      {allProps.children}
    </LegacyFieldSet>,
  );
};
