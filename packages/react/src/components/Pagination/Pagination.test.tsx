import { render as renderRtl, screen } from '@testing-library/react';

import type { PaginationProps } from './Pagination';

import { Pagination } from './';

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
