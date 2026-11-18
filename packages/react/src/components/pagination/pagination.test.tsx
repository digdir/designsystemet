import { pagination } from '@digdir/designsystemet-web/pagination';
import { render, screen } from '@testing-library/react';
import '../../../../css/src/pagination.css'; // Needed to test prev/next visibility, which is controlled by CSS
import { Pagination } from './';
import type { PaginationProps } from './pagination';

const renderWithRoot = (props: PaginationProps) => {
  render(
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
        <Pagination.Item />
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
    render(
      <Pagination aria-label='Pagination'>
        <Pagination.Button>1</Pagination.Button>
      </Pagination>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render as anchor when asChild is true', () => {
    render(
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

describe('Pagination prev/next visibility', () => {
  const total = 10;
  const cases = [1, 2, 3].flatMap((show) =>
    [1, 5, total].map((current) => ({ show, current })),
  );

  it.each(cases)('show $show on page $current of 10', ({ show, current }) => {
    const { pages, prev, next } = pagination({ current, total, show });

    render(
      <Pagination aria-label='Pagination'>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button inert={prev.inert}>Forrige</Pagination.Button>
          </Pagination.Item>
          {pages.map(({ value, ...props }, index) => (
            <Pagination.Item key={value || `ellipsis-${index}`}>
              <Pagination.Button {...props}>{value}</Pagination.Button>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button inert={next.inert}>Neste</Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
    );

    const prevButton = screen.getByText('Forrige');
    const nextButton = screen.getByText('Neste');
    const currentButton = screen.getByText(`${current}`);

    expect(currentButton).toBeVisible();
    expect(currentButton).toHaveAttribute('aria-current', 'page');

    if (current > 1) expect(prevButton).toBeVisible();
    else expect(prevButton).not.toBeVisible();

    if (current < total) expect(nextButton).toBeVisible();
    else expect(nextButton).not.toBeVisible();
  });
});
