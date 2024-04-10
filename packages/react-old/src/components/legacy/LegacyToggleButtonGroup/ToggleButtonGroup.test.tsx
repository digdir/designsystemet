import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { LegacyToggleButtonGroup } from '.';
import type { LegacyToggleButtonGroupProps, LegacyToggleButtonProps } from '.';

const user = userEvent.setup();

// Test data:
const items: LegacyToggleButtonProps[] = [
  { value: 'value 1', label: 'Label 1' },
  { value: 'value 2', label: 'Label 2' },
  { value: 'value 3', label: 'Label 3' },
];
const defaultProps: LegacyToggleButtonGroupProps = {
  items,
};

describe('LegacyToggleButtonGroup', () => {
  it('Renders all items', () => {
    render();
    expect(getAllButtons()).toHaveLength(items.length);
    items.forEach((item) => {
      expect(getButtonByLabel(item.label as string)).toBeInTheDocument();
    });
  });

  it('Selects the first item by default', () => {
    render();
    expectPressed(0);
  });

  it('Selects the value provided by the "selectedValue" property', () => {
    const index = 1;
    const selectedValue = items[index].value;
    render({ selectedValue });
    expectPressed(index);
  });

  it('Selects the value provided by the "selectedValue" property when rerendered', () => {
    const { rerender } = render();
    const index = 1;
    const value = items[index].value;
    rerender(
      <LegacyToggleButtonGroup
        {...defaultProps}
        selectedValue={value}
      />,
    );
    expectPressed(index);
  });

  it('Selects an item when the user clicks on it', async () => {
    render();
    const index = 1;
    await user.click(getButtonByIndex(index));
    expectPressed(index);
  });

  it('Calls onChange with the selected value when the user clicks on an item', async () => {
    const onChange = vi.fn();
    render({ onChange });
    const index = 1;
    await user.click(getButtonByIndex(index));
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(items[index].value);
  });

  it('Selects an item when the user presses the enter key on it', async () => {
    render();
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expectPressed(0);
  });

  it('Calls onChange with the selected value when the user presses the enter key on an item', async () => {
    const onChange = vi.fn();
    render({ onChange });
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(items[0].value);
  });

  it('Throws error if item values are not unique', () => {
    const renderFn = () => {
      render({
        items: [...items, { value: items[0].value, label: 'Label 4' }],
      });
    };
    vi.spyOn(console, 'error').mockImplementation(vi.fn()); // Keeps the console output clean
    expect(renderFn).toThrow('Each value must be unique.');
  });

  it('Throws error if the value given in selectedValue is not present among the items', () => {
    const renderFn = () =>
      render({ selectedValue: 'Some value that is not in the list' });
    vi.spyOn(console, 'error').mockImplementation(vi.fn()); // Keeps the console output clean
    const er = 'The given selected item value must exist in the list of items.';
    expect(renderFn).toThrow(er);
  });

  const getAllButtons = () => screen.getAllByRole('button');

  const getButtonByIndex = (index: number) => getAllButtons()[index];

  const getButtonByLabel = (name: string) =>
    screen.getByRole('button', { name });

  const expectPressed = (index: number) => {
    getAllButtons().forEach((button, i) => {
      const pressed = i === index;
      expect(button).toHaveAttribute('aria-pressed', pressed.toString());
      if (pressed) expect(button).toHaveClass('pressed');
      else expect(button).not.toHaveClass('pressed');
    });
  };
});

const render = (props: Partial<LegacyToggleButtonGroupProps> = {}) =>
  renderRtl(
    <LegacyToggleButtonGroup
      {...defaultProps}
      {...props}
    />,
  );
