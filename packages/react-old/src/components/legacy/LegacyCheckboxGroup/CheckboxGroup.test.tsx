import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LegacyCheckboxGroup } from '.';
import type { LegacyCheckboxGroupProps, LegacyCheckboxGroupItem } from '.';

const user = userEvent.setup();

const defaultProps: LegacyCheckboxGroupProps = {
  items: [
    { label: 'Test 1', name: 'test1' },
    { label: 'Test 2', name: 'test2' },
  ],
};

describe('CheckboxGroup', () => {
  it('Should display a checkbox for each item', () => {
    render();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(
      defaultProps.items.length,
    );
  });

  it('Should display legend', () => {
    const legend = 'Lorem ipsum';
    render({ legend });
    expect(screen.getByText(legend)).toBeDefined();
  });

  it('Should display description', () => {
    const description = 'Lorem ipsum dolor sit amet';
    render({ description });
    expect(screen.getByText(description)).toBeDefined();
  });

  it('Should display error message if given', () => {
    const error = 'Something is wrong';
    render({ error });
    expect(screen.getByText(error)).toBeDefined();
  });

  it('Should throw an error if there are duplicate names', () => {
    const renderFn = () =>
      render({
        items: [
          { label: 'Test 1', name: 'duplicated name' },
          { label: 'Test 2', name: 'duplicated name' },
        ],
      });
    jest.spyOn(console, 'error').mockImplementation(jest.fn()); // Keeps the console output clean
    expect(renderFn).toThrow('Each name in the checkbox group must be unique.');
  });

  it('Should call onChange handler with an array of the selected names when a checkbox is checked', async () => {
    const onChange = jest.fn();
    render({ onChange });
    await act(() => user.click(screen.queryAllByRole('checkbox')[0]));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([defaultProps.items[0].name]);
    await act(() => user.click(screen.queryAllByRole('checkbox')[1]));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([
      defaultProps.items[0].name,
      defaultProps.items[1].name,
    ]);
    await act(() => user.click(screen.queryAllByRole('checkbox')[0]));
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith([defaultProps.items[1].name]);
  });

  it('Checkboxes should be checked if the "items" prop tells them to be', () => {
    render({
      items: [
        { checked: false, label: 'Test 1', name: 'test1' },
        { checked: true, label: 'Test 2', name: 'test2' },
      ],
    });
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it('Checkboxes should update their "checked" state if the component rerenders with another configuration', () => {
    const items: LegacyCheckboxGroupItem[] = [
      { label: 'Test 1', name: 'test1' },
      { label: 'Test 2', name: 'test2' },
    ];
    const { rerender } = render({ items });
    items[0] = { checked: true, label: 'Test 1', name: 'test1' };
    items[1] = { checked: false, label: 'Test 2', name: 'test2' };
    rerender(<LegacyCheckboxGroup items={items} />);

    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('Checkboxes should not be checked by default', () => {
    render();
    const checkboxes = screen.queryAllByRole('checkbox');
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it('Checkboxes should not be disabled by default', () => {
    render();
    const checkboxes = screen.queryAllByRole('checkbox');
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeDisabled());
  });

  it('Should switch "checked" state of a checkbox when the user clicks on it', async () => {
    render();
    const checkboxes = screen.queryAllByRole('checkbox');
    await act(() => user.click(checkboxes[0]));
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    await act(() => user.click(checkboxes[1]));
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    await act(() => user.click(checkboxes[0]));
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    await act(() => user.click(checkboxes[1]));
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('All checkboxes should be disabled when the "disabled" prop is true', () => {
    render({ disabled: true });
    const checkboxes = screen.queryAllByRole('checkbox');
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled());
  });

  it('onChange handler should not be called when the "disabled" prop is true', async () => {
    const onChange = jest.fn();
    render({ disabled: true, onChange });
    await act(() => user.click(screen.queryAllByRole('checkbox')[0]));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Checkboxes should be rendered with the properties given in the "items" prop', () => {
    const description = 'Description',
      checkboxId = 'id',
      label = 'Label',
      name = 'name';
    render({
      items: [{ description, disabled: true, checkboxId, label, name }],
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('name')).toEqual(name);
    expect(checkbox.getAttribute('id')).toEqual(checkboxId);
    expect(checkbox).toBeDisabled();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByText(description)).toBeDefined();
  });

  it('Renders all checkboxes with presentation role when the "presentation" property is true', () => {
    render({ presentation: true });
    const numOfCheckboxes = defaultProps.items.length;
    expect(screen.queryAllByRole('presentation')).toHaveLength(numOfCheckboxes);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });
});

const render = (props: Partial<LegacyCheckboxGroupProps> = {}) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(<LegacyCheckboxGroup {...allProps} />);
};
