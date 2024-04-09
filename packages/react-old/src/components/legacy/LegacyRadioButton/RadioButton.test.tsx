import assert from 'assert';

import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { LegacyRadioButton } from '.';
import type { LegacyRadioButtonProps } from '.';

const user = userEvent.setup();

// Test data
const onChange = vi.fn();
const name = 'radio-ga-ga';
const value = 'radio-goo-goo';
const defaultProps: LegacyRadioButtonProps = {
  onChange,
  name,
  value,
};

describe('RadioButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renders a radio button', () => {
    render();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('Is not checked by default', () => {
    const wrapper = renderAndGetWrapper();
    expect(screen.getByRole('radio')).not.toBeChecked();
    expect(wrapper).not.toHaveClass('radio--checked');
  });

  it('Is checked if the "checked" prop is true', () => {
    const wrapper = renderAndGetWrapper({ checked: true });
    expect(screen.getByRole('radio')).toBeChecked();
    expect(wrapper).toHaveClass('checked');
  });

  it('Is not checked if the "checked" prop is false', () => {
    const wrapper = renderAndGetWrapper({ checked: false });
    expect(screen.getByRole('radio')).not.toBeChecked();
    expect(wrapper).not.toHaveClass('checked');
  });

  it('Calls onChange when user clicks', async () => {
    const wrapper = renderAndGetWrapper();
    await act(() => user.click(wrapper));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('Does not call onChange when user clicks and the radio button is disabled', async () => {
    const wrapper = renderAndGetWrapper({ disabled: true });
    await act(() => user.click(wrapper));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Displays label text', () => {
    const label = 'All we hear is radio ga ga';
    render({ label });
    expect(screen.getByText(label)).toBeDefined();
  });

  it('Does not display label text, but still makes it accessible, when hideLabel is true', () => {
    const label = 'All we hear is radio ga ga';
    render({ hideLabel: true, label });
    expect(screen.getByText(label).style.display).toEqual('none');
    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it('Renders radio button with given radioId', () => {
    const radioId = 'radio-whats-new';
    render({ radioId });
    expect(screen.getByRole('radio').id).toEqual(radioId);
  });

  it('Renders radio button with given name', () => {
    render();
    expect(screen.getByRole('radio').getAttribute('name')).toEqual(name);
  });

  it('Displays description if given', () => {
    const description = 'Radio, someone still loves you';
    render({ description });
    expect(screen.getByText(description)).toBeDefined();
  });

  it('Renders with correct classes by default', () => {
    const wrapper = renderAndGetWrapper();
    expect(wrapper).toHaveClass('small');
    expect(wrapper).not.toHaveClass('error');
    expect(wrapper).not.toHaveClass('disabled');
  });

  it('Renders with "xsmall" size class by if size is set to "Xsmall"', () => {
    const wrapper = renderAndGetWrapper({ size: 'xsmall' });
    expect(wrapper).toHaveClass('xsmall');
  });

  it('Renders with "small" size class by if size is set to "Small"', () => {
    const wrapper = renderAndGetWrapper({ size: 'small' });
    expect(wrapper).toHaveClass('small');
  });

  it('Renders with "error" class if the "error" property is true', () => {
    const wrapper = renderAndGetWrapper({ error: true });
    expect(wrapper).toHaveClass('error');
  });

  it('Renders withot "error" class if the "error" property is false', () => {
    const wrapper = renderAndGetWrapper({ error: false });
    expect(wrapper).not.toHaveClass('error');
  });

  it('Renders with "disabled" class if the "disabled" property is true', () => {
    const wrapper = renderAndGetWrapper({ disabled: true });
    expect(wrapper).toHaveClass('disabled');
  });

  it('Renders without "disabled" class if the "disabled" property is false', () => {
    const wrapper = renderAndGetWrapper({ disabled: false });
    expect(wrapper).not.toHaveClass('disabled');
  });

  it.each([false, undefined])(
    'Does not have presentation role when the "presentation" property is %s',
    (presentation) => {
      render({ presentation });
      expect(screen.queryByRole('presentation')).toBeFalsy();
    },
  );

  it('Has presentation role when the "presentation" property is true', () => {
    render({ presentation: true });
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).toBeFalsy();
  });

  it('Displays label and description when they are React nodes', () => {
    const labelText = 'Label';
    const descriptionText = 'Description';
    render({
      label: <span>{labelText}</span>,
      description: <span>{descriptionText}</span>,
    });
    expect(screen.getByText(labelText)).toBeInTheDocument();
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('Has clickable label text by default if label is set', async () => {
    const label = 'Label';
    render({ label });
    await act(() => user.click(screen.getByText(label)));
    expect(onChange).toHaveBeenCalled();
  });

  it('Does not have clickable label text if the "presentation" property is true and the label is a React node', async () => {
    const labelText = 'Label';
    render({
      label: <span>{labelText}</span>,
      presentation: true,
    });
    await act(() => user.click(screen.getByText(labelText)));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Does not have clickable label text if the "presentation" property is true and the description is a React node', async () => {
    const descriptionText = 'Description';
    render({
      label: <span>{descriptionText}</span>,
      presentation: true,
    });
    await act(() => user.click(screen.getByText(descriptionText)));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Has clickable radio button even if the "presentation" property is true and the label is a React node', async () => {
    const name = 'Label';
    render({
      label: <span>{name}</span>,
      presentation: true,
    });
    await act(() => user.click(screen.getByRole('presentation', { name })));
    expect(onChange).toHaveBeenCalled();
  });
});

const render = (props: Partial<LegacyRadioButtonProps> = {}) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(<LegacyRadioButton {...allProps} />);
};

const renderAndGetWrapper = (
  props: Partial<LegacyRadioButtonProps> = {},
): Element => {
  const { container } = render(props);
  const wrapper = container.querySelector('.radio');
  assert(wrapper !== null);
  return wrapper;
};
