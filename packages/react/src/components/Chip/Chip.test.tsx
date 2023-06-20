import React from 'react';
import { getByRole, render, screen } from '@testing-library/react';

import { Chip } from '.';

describe('Chip', () => {
  it('should render a normal chip as default', () => {
    render(<Chip>Norwegian</Chip>);

    expect(screen.getByRole('button', { name: 'Norwegian' }));
    expect(screen.getByRole('button', { name: 'Norwegian' })).not.toHaveClass(
      'removable',
    );
  });

  it('should render removable chip ', () => {
    render(<Chip.Removable aria-label='Slett nynorsk'>Nynorsk</Chip.Removable>);

    expect(screen.getByRole('button', { name: 'Slett nynorsk' })).toHaveClass(
      'removable',
    );
  });

  it('should be possible to render a group', () => {
    render(
      <Chip.Group>
        <Chip>First item</Chip>
      </Chip.Group>,
    );

    expect(screen.getByRole('list')).toHaveTextContent('First item');
    expect(screen.getByRole('listitem')).toHaveTextContent('First item');
  });

  it('should support polymorphism component', () => {
    render(
      <Chip
        as='a'
        href='#'
      >
        First item
      </Chip>,
    );
    expect(screen.getByRole('link', { name: 'First item' }));
  });
});
