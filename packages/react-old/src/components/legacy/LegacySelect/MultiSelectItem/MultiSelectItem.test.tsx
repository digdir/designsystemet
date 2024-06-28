import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import type { MultiSelectItemProps } from './MultiSelectItem';
import { MultiSelectItem } from './MultiSelectItem';

const user = userEvent.setup();

const onDeleteButtonClick = vi.fn();
const label = 'Option';
const defaultMultiSelectItemProps: MultiSelectItemProps = {
  disabled: false,
  onDeleteButtonClick,
  label,
};

describe('MultiSelectItem', () => {
  it('Displays given value', () => {
    renderMultiSelectItem();
    expect(screen.getByText(label)).toBeTruthy();
  });

  it('Calls onDeleteButtonClick when delete button is clicked', async () => {
    renderMultiSelectItem();
    await act(() => user.click(screen.getByRole('button')));
    expect(onDeleteButtonClick).toHaveBeenCalledTimes(1);
  });

  it('Has accessible name on delete button if given', () => {
    const deleteButtonLabel = 'Delete item';
    renderMultiSelectItem({ deleteButtonLabel });
    expect(screen.getByRole('button')).toHaveAccessibleName(deleteButtonLabel);
  });

  it('Enables delete button when not disabled', () => {
    renderMultiSelectItem();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('Disables delete button when disabled', () => {
    renderMultiSelectItem({ disabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

const renderMultiSelectItem = (props?: Partial<MultiSelectItemProps>) =>
  render(
    <MultiSelectItem
      {...defaultMultiSelectItemProps}
      {...props}
    />,
  );
