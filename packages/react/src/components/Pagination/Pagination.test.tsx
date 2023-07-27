import { act, render as renderRtl, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import type { PaginationProps } from './Pagination';
import { Pagination } from './Pagination';

const user = userEvent.setup();

const defaultProps = {
  currentPage: 5,
  totalPages: 10,
  nextLabel: 'Next',
  previousLabel: 'Previous',
};

describe('Pagination', () => {
  it('Compact pagination should render correctly with default props', () => {
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

  it('Should render correctly with default props', () => {
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

  it('should call onChange with the correct page number when buttons are clicked', async () => {
    const mockOnChange = jest.fn();
    render({
      onChange: mockOnChange,
      ...defaultProps,
    });

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
  });

  it('should not show next button on first page', () => {
    render({
      totalPages: 10,
      currentPage: 1,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      onChange: () => null,
    });

    expect(
      screen.queryByRole('button', { name: 'Previous' }),
    ).not.toBeInTheDocument();
  });

  it('should not show previous button on last page', () => {
    render({
      totalPages: 10,
      currentPage: 10,
      nextLabel: 'Next',
      previousLabel: 'Previous',
      onChange: () => null,
    });

    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
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
});

const render = (props: PaginationProps) => renderRtl(<Pagination {...props} />);
