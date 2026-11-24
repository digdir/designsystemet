import { renderHook } from '@testing-library/react';
import { usePagination } from './use-pagination';

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

  it('should prevent previous when at start', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1 }),
    );

    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('should prevent next when at end', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 10 }),
    );

    expect(result.current.hasPrev).toBe(true);
    expect(result.current.hasNext).toBe(false);
  });

  it('marks the current page and does not leak value', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 3, showPages: 5 }),
    );
    const current = result.current.pages.find(({ page }) => page === 3);

    expect(current?.buttonProps).toEqual({
      'aria-current': 'page',
      onClick: expect.any(Function),
    });
  });

  it('returns null buttonProps for ellipsis entries', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 5, showPages: 7 }),
    );
    const { pages } = result.current;

    expect(pages.map(({ page }) => page)).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      10,
    ]);
    expect(pages[1]).toEqual({
      page: 'ellipsis',
      itemKey: 'ellipsis-1',
      buttonProps: null,
    });
    expect(pages[5]).toEqual({
      page: 'ellipsis',
      itemKey: 'ellipsis-5',
      buttonProps: null,
    });

    for (const { page, buttonProps } of pages)
      if (page !== 'ellipsis') expect(buttonProps).not.toBeNull();
  });

  it('marks prev/next as inert only when out of bounds', () => {
    const at = (currentPage: number) =>
      renderHook(() => usePagination({ totalPages: 10, currentPage })).result
        .current;

    expect(at(1).prevButtonProps.inert).toBe(true);
    expect(at(1).nextButtonProps.inert).toBeUndefined();
    expect(at(5).prevButtonProps.inert).toBeUndefined();
    expect(at(5).nextButtonProps.inert).toBeUndefined();
    expect(at(10).prevButtonProps.inert).toBeUndefined();
    expect(at(10).nextButtonProps.inert).toBe(true);
  });

  it('should trigger onChange when clicking button', () => {
    const mockOnChange = vi.fn();
    const event = {
      preventDefault: () => {},
    } as React.MouseEvent<HTMLButtonElement>;
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1, onChange: mockOnChange }),
    );

    result.current.nextButtonProps.onClick?.(event);

    expect(mockOnChange).toHaveBeenCalledWith(event, 2);
  });

  it('should not trigger onChange when clicking previous button and in start', () => {
    const mockOnChange = vi.fn();
    const event = {
      preventDefault: () => {},
    } as React.MouseEvent<HTMLButtonElement>;
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 1, onChange: mockOnChange }),
    );

    result.current.prevButtonProps.onClick?.(event);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not render negative pages', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 5, currentPage: 1, showPages: 7 }),
    );

    expect(result.current.pages).not.toContainEqual({
      page: -1,
      itemKey: 'page--1',
      buttonProps: expect.any(Object),
    });
    expect(result.current.pages).not.toContainEqual({
      page: 0,
      itemKey: 'page-0',
      buttonProps: expect.any(Object),
    });
    expect(result.current.pages).toContainEqual({
      page: 1,
      itemKey: 'page-1',
      buttonProps: expect.any(Object),
    });
  });
});
