import { render as renderRtl, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import type { PaginationProps } from './Pagination';
import { Pagination } from './Pagination';

describe('Pagination component', () => {
  it('should render correctly with default props', () => {
    const { container, getByLabelText } = render({
      currentPage: 3,
      totalPages: 8,
      onChange: () => null,
      nextLabel: 'Next',
      previousLabel: 'Previous',
    });

    expect(container.querySelectorAll('.listitem')).toHaveLength(8);

    expect(getByLabelText('Next')).toBeInTheDocument();

    expect(getByLabelText('Previous')).toBeInTheDocument();
  });

  it('should call onChange with the correct page number when "Next" or "Previous" button is clicked', () => {
    const mockOnChange = jest.fn();
    const { getByLabelText } = render({
      currentPage: 3,
      totalPages: 8,
      onChange: mockOnChange,
      nextLabel: 'Next',
      previousLabel: 'Previous',
    });

    fireEvent.click(getByLabelText('Next'));
    expect(mockOnChange).toHaveBeenCalledWith(4);

    fireEvent.click(getByLabelText('Previous'));
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange with the correct page number when a pagination item is clicked', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render({
      currentPage: 3,
      totalPages: 8,
      onChange: mockOnChange,
      nextLabel: 'Next',
      previousLabel: 'Previous',
    });

    fireEvent.click(getByText('5'));
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });
});

const render = (props: PaginationProps) => renderRtl(<Pagination {...props} />);
