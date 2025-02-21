import { renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('should provide correct amount of pages with 10 pages when current page is 6', () => {
    const expected = [
      [6],
      [6, 7],
      [5, 6, 7],
      [5, 6, '', 10],
      [1, '', 6, '', 10],
      [1, '', 6, 7, '', 10],
      [1, '', 5, 6, 7, '', 10],
      [1, '', 5, 6, 7, 8, 9, 10],
      [1, '', 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ];

    for (const expectPages of expected) {
      const { result } = renderHook(() =>
        usePagination({
          totalPages: 10,
          currentPage: 6,
          showPages: expectPages.length,
        }),
      );
      const { pages } = result.current;

      expect(pages).toHaveLength(expectPages.length);

      expectPages.forEach((value, index) => {
        expect(pages[index].itemKey).toBe(
          value ? `page-${value}` : `ellipsis-${index}`,
        );
      });
    }
  });

  it('should prevet previous when at start', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1 }),
    );

    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.prevButtonProps['aria-disabled']).toBe(true);
    expect(result.current.nextButtonProps['aria-disabled']).toBe(false);
  });

  it('should prevet next when at end', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 10 }),
    );

    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.prevButtonProps['aria-disabled']).toBe(false);
    expect(result.current.nextButtonProps['aria-disabled']).toBe(true);
  });

  it('should trigger onChange when clickinging button', async () => {
    const mockOnChange = vi.fn();
    const event = { preventDefault: () => {} } as MouseEvent<HTMLButtonElement>;
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1, onChange: mockOnChange }),
    );

    result.current.nextButtonProps.onClick?.(event);

    expect(mockOnChange).toHaveBeenCalledWith(event, 2);
  });

  it('should not trigger onChange when clickinging previous button and in start', async () => {
    const mockOnChange = vi.fn();
    const event = { preventDefault: () => {} } as MouseEvent<HTMLButtonElement>;
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1, onChange: mockOnChange }),
    );

    result.current.prevButtonProps.onClick?.(event);

    expect(mockOnChange).not.toHaveBeenCalledWith(event, 2);
  });
});
