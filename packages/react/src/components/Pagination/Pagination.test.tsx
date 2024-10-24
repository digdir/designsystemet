import {
  renderHook,
  render as renderRtl,
  screen,
} from '@testing-library/react';
import type { MouseEvent } from 'react';

import type { PaginationProps } from './Pagination';

import { Pagination, usePagination } from './';

const renderWithRoot = (props: PaginationProps) => {
  renderRtl(
    <Pagination {...props}>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button>Forrige</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button aria-current='page'>1</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>2</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>3</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>6</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>7</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>Neste</Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>,
  );
};

describe('Pagination', () => {
  it('should render correctly with default props', () => {
    renderWithRoot({
      'aria-label': 'Pagination',
    });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render correctly with custom props', () => {
    renderWithRoot({
      'aria-label': 'Pagination',
      'data-size': 'lg',
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render all children correctly', () => {
    renderWithRoot({ 'aria-label': 'Pagination' });

    expect(screen.getByText('Forrige')).toBeInTheDocument();
    expect(screen.getByText('Neste')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});

describe('Pagination.Button', () => {
  it('should render correctly with default props', () => {
    renderRtl(
      <Pagination aria-label='Pagination'>
        <Pagination.Button>1</Pagination.Button>
      </Pagination>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render as anchor when asChild is true', () => {
    renderRtl(
      <Pagination aria-label='Pagination'>
        <Pagination.Button asChild>
          <a href='#1'>1</a>
        </Pagination.Button>
      </Pagination>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

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
