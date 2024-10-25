import { render, screen } from '@testing-library/react';
import type { BreadcrumbsProps } from './Breadcrumbs';

import { Breadcrumbs } from './';

const renderWithRoot = (props?: BreadcrumbsProps) =>
  render(
    <Breadcrumbs aria-label='Du er her:' {...props}>
      <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
        Nivå 3
      </Breadcrumbs.Link>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 4</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>,
  );

describe('Breadcrumbs', () => {
  it('should render correctly with default props', () => {
    renderWithRoot();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Breadcrumbs.List', () => {
  it('should render with aria-current on last item', () => {
    renderWithRoot();
    const links = screen.getAllByRole('link');
    expect(links.at(0)).not.toHaveAttribute('aria-current', 'page');
    expect(links.at(1)).not.toHaveAttribute('aria-current', 'page');
    expect(links.at(2)).not.toHaveAttribute('aria-current', 'page');
    expect(links.at(-1)).toHaveAttribute('aria-current', 'page');
  });

  it('should move aria-current to item when re-rendering', () => {
    renderWithRoot();
    const links = screen.getAllByRole('link');
    expect(links.at(-1)).toHaveAttribute('aria-current', 'page');

    // Re-render with additional level
    render(
      <Breadcrumbs aria-label='Du er her:'>
        <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
          Nivå 3
        </Breadcrumbs.Link>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 4</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#'>Nivå 5</Breadcrumbs.Link>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>,
    );

    expect(links.at(-2)).not.toHaveAttribute('aria-current', 'page');
    expect(links.at(-1)).toHaveAttribute('aria-current', 'page');
  });
});
