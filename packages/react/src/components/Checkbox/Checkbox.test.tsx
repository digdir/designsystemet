import assert from 'assert';

import React from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { CheckboxProps } from './';
import { Checkbox } from './';

const user = userEvent.setup();

const defaultProps: CheckboxProps = {
  onChange: jest.fn,
};

describe('Checkbox', () => {
  it('Should not be checked by default', () => {
    render();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('Should be checked if the "checked" prop is true', () => {
    render({ checked: true });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('Should call onChange when user clicks', async () => {
    const onChange = jest.fn();
    const wrapper = renderAndGetWrapper({ onChange });
    await act(() => user.click(wrapper));
    expect(onChange).toHaveBeenCalled();
  });

  it('Should not call onChange when user clicks and the checkbox is disabled', async () => {
    const onChange = jest.fn();
    const wrapper = renderAndGetWrapper({ disabled: true, onChange });
    await act(() => user.click(wrapper));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should not display checkbox when read-only', async () => {
    render({ checked: false, readOnly: true });
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes).toHaveLength(0);
  });

  it('Should display label text', () => {
    const label = 'Lorem ipsum';
    render({ label });
    expect(screen.getByText(label)).toBeDefined();
  });

  it('Should not display label text, but still make it accessible, when hideLabel is true', () => {
    const label = 'Lorem ipsum';
    render({ hideLabel: true, label });
    expect(screen.queryByText(label)).toBeFalsy();
    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it('Should render checkbox with given checkboxId', () => {
    const checkboxId = 'the-checkbox';
    render({ checkboxId });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.id).toEqual(checkboxId);
  });

  it('Should render checkbox with given name', () => {
    const name = 'the-checkbox';
    render({ name });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('name')).toEqual(name);
  });

  it('Should display description', () => {
    const description = 'Lorem ipsum dolor sit amet';
    render({ description });
    expect(screen.getByText(description)).toBeDefined();
  });
});

const render = (props: Partial<CheckboxProps> = {}) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(<Checkbox {...allProps} />);
};

const renderAndGetWrapper = (props: Partial<CheckboxProps> = {}): Element => {
  const { container } = render(props);
  const wrapper = container.querySelector('.checkbox');
  assert(wrapper !== null);
  return wrapper;
};
