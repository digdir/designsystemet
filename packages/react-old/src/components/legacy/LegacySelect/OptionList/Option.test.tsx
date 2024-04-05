import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { LegacySingleSelectOption } from '../types';

import { Option } from './Option';
import type { OptionProps } from './Option';

const user = userEvent.setup();

// Test data:
const id = 'test-id';
const onClick = vi.fn();
const label = 'Option';
const value = 'option';
const option: LegacySingleSelectOption = { label, value };
const defaultProps: OptionProps = {
  active: false,
  id,
  multiple: false,
  onClick,
  option,
  selected: false,
};

describe('Option', () => {
  it('Renders label by default', () => {
    render();
    expect(screen.getByRole('option')).toHaveTextContent(label);
  });

  it('Renders with given value', () => {
    render();
    expect(screen.getByRole('option')).toHaveAttribute('value', value);
  });

  it('Renders formattedLabel if provided', () => {
    const formattedLabelText = 'Formatted label';
    const formattedLabel = <span>{formattedLabelText}</span>;
    render({ option: { ...option, formattedLabel } });
    expect(screen.getByRole('option')).toHaveTextContent(formattedLabelText);
  });

  it('Calls onClick with value as a parameter when user clicks', async () => {
    render();
    await user.click(screen.getByRole('option'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(value);
  });

  it('Renders option with given id', () => {
    render();
    expect(screen.getByRole('option')).toHaveAttribute('id', id);
  });
});

const render = (props: Partial<OptionProps> = {}) =>
  renderRtl(
    <Option
      {...defaultProps}
      {...props}
    />,
  );
