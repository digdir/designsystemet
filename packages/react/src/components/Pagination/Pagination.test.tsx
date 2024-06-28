import {
  render as renderRtl,
  screen,
  renderHook,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import type { PaginationRootProps } from './PaginationRoot';

import type { PaginationProps } from './';
import { Pagination, usePagination } from './';

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

    const ellipsisElements = screen.getAllByText('…');
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

    const ellipsisElements = screen.getAllByText('…');
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
    expect(screen.getByLabelText('Side 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 3')).toBeInTheDocument();
  });

  it('should call onChange with the correct page number when buttons are clicked', async () => {
    const mockOnChange = vi.fn();
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

    await act(() => user.click(screen.getByLabelText('Side 1')));
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
    expect(screen.getByLabelText('Side 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 10')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 5')).toHaveAttribute(
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
    expect(screen.getByLabelText('Side 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Side 10')).toBeInTheDocument();
  });

  it('should show custom aria-labels correctly', () => {
    render({
      onChange: () => null,
      itemLabel: (num) => `Page ${num}`,
      ...defaultProps,
    });

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
  });
});

const renderWithRoot = (props: PaginationRootProps) => {
  renderRtl(
    <Pagination.Root {...props}>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous>Forrige</Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button isActive>1</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>2</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>3</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>6</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>7</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next>Neste</Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>,
  );
};

describe('Pagination.Root', () => {
  it('should render correctly with default props', () => {
    renderWithRoot({});

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render correctly with custom props', () => {
    renderWithRoot({
      size: 'lg',
      compact: true,
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render all children correctly', () => {
    renderWithRoot({});

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
      <Pagination.Root>
        <Pagination.Button>1</Pagination.Button>
      </Pagination.Root>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render as anchor when asChild is true', () => {
    renderRtl(
      <Pagination.Root>
        <Pagination.Button asChild>
          <a href='#1'>1</a>
        </Pagination.Button>
      </Pagination.Root>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

describe('usePagination', () => {
  it('should provide correct amount of pages with 10 pages when current page is 6', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 6 }),
    );
    const { pages } = result.current;

    expect(pages).toHaveLength(7);
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe('ellipsis');
    expect(pages[2]).toBe(5);
    expect(pages[3]).toBe(6);
    expect(pages[4]).toBe(7);
    expect(pages[5]).toBe('ellipsis');
    expect(pages[6]).toBe(10);
  });

  it('should provide correct amount of pages with 10 pages when current page is 6 and compact', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 6, compact: true }),
    );
    const { pages } = result.current;

    expect(pages).toHaveLength(5);
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe('ellipsis');
    expect(pages[2]).toBe(6);
    expect(pages[3]).toBe('ellipsis');
    expect(pages[4]).toBe(10);
  });

  it('should update current page and pages correctly when setCurrentPage is called', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 2 }),
    );

    const initalCurrentPage = result.current.currentPage;
    expect(initalCurrentPage).toBe(2);

    renderHook(() => result.current.setCurrentPage(5));

    const updatedCurrentPage = result.current.currentPage;
    expect(updatedCurrentPage).toBe(5);

    const { pages } = result.current;
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe('ellipsis');
    expect(pages[2]).toBe(4);
    expect(pages[3]).toBe(5);
    expect(pages[4]).toBe(6);
    expect(pages[5]).toBe('ellipsis');
    expect(pages[6]).toBe(10);
  });

  it('should update current page and pages correctly when setNextPage is called ', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 2 }),
    );

    const initalCurrentPage = result.current.currentPage;
    expect(initalCurrentPage).toBe(2);

    renderHook(() => result.current.nextPage());

    const updatedCurrentPage = result.current.currentPage;
    expect(updatedCurrentPage).toBe(3);

    const { pages } = result.current;
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe(2);
    expect(pages[2]).toBe(3);
    expect(pages[3]).toBe(4);
    expect(pages[4]).toBe(5);
    expect(pages[5]).toBe('ellipsis');
    expect(pages[6]).toBe(10);
  });

  it('should update current page and pages correctly when setPreviousPage is called ', () => {
    const { result } = renderHook(() =>
      usePagination({ totalPages: 10, currentPage: 9 }),
    );

    const initalCurrentPage = result.current.currentPage;
    expect(initalCurrentPage).toBe(9);

    renderHook(() => result.current.previousPage());

    const updatedCurrentPage = result.current.currentPage;
    expect(updatedCurrentPage).toBe(8);

    const { pages } = result.current;
    expect(pages[0]).toBe(1);
    expect(pages[1]).toBe('ellipsis');
    expect(pages[2]).toBe(6);
    expect(pages[3]).toBe(7);
    expect(pages[4]).toBe(8);
    expect(pages[5]).toBe(9);
    expect(pages[6]).toBe(10);
  });
});
