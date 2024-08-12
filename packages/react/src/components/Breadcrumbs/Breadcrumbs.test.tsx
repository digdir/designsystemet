import { render, screen } from '@testing-library/react';
import type { BreadcrumbsRootProps } from './BreadcrumbsRoot';

import { Breadcrumbs } from './';

const renderWithRoot = (props: BreadcrumbsRootProps) => {
  render(
    <Breadcrumbs.Root {...props}>
      <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
        Nivå 3
      </Breadcrumbs.Link>
      <Breadcrumbs.Nav aria-label='Du er her:'>
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
      </Breadcrumbs.Nav>
    </Breadcrumbs.Root>,
  );
};

describe('Breadcrumbs.Root', () => {
  it('should render correctly with default props', () => {
    renderWithRoot({});

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render correctly with custom props', () => {
    renderWithRoot({
      size: 'lg',
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
