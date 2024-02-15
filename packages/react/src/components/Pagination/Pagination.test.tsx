import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PaginationRootProps } from './PaginationRoot';

import type { PaginationProps } from './';
import { Pagination } from './';

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
      size: 'large',
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

describe('Pagination.Link', () => {
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
