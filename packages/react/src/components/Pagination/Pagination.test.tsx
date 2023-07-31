import { act, render as renderRtl, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import type { PaginationProps } from './Pagination';
import { Pagination } from './Pagination';

const render = (props: PaginationProps) => renderRtl(<Pagination {...props} />);

const defaultProps = {
  currentPage: 5,
  totalPages: 10,
  nextLabel: 'Next',
  previousLabel: 'Previous',
};

describe('Pagination', () => {
  it('should render correctly with default props', () => {
    render({
      onChange: () => null,
      ...defaultProps,
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(7);

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBe(2);

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
  });

  it('compact pagination should render correctly with default props', () => {
    render({
      compact: true,
      onChange: () => null,
      ...defaultProps,
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBe(2);

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
  });

  it('should render correctly when totalPages are 3', () => {
    render({
      totalPages: 3,
      currentPage: 2,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      onChange: () => null,
    });

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('should call onChange with the correct page number when buttons are clicked', async () => {
    const mockOnChange = jest.fn();
    render({
      onChange: mockOnChange,
      ...defaultProps,
    });

    const user = userEvent.setup();

    await act(() => user.click(screen.getByRole('button', { name: 'Next' })));
    expect(mockOnChange).toHaveBeenCalledWith(6);

    await act(() =>
      user.click(screen.getByRole('button', { name: 'Previous' })),
    );
    expect(mockOnChange).toHaveBeenCalledWith(4);

    await act(() => user.click(screen.getByLabelText('Page 1')));
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('should show aria-current and aria-label correctly', () => {
    render({
      onChange: () => null,
      ...defaultProps,
    });

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 10')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('should show aria-labels when hideLabels = true', () => {
    render({
      onChange: () => null,
      ...defaultProps,
      hideLabels: true,
    });

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 10')).toBeInTheDocument();
  });

  it('should show custom aria-labels correctly', () => {
    render({
      onChange: () => null,
      itemLabel: (num) => `Side ${num}`,
      ...defaultProps,
    });

    expect(screen.getByRole('button', { name: 'Side 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Side 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Side 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Side 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Side 10' })).toBeInTheDocument();
  });
});
