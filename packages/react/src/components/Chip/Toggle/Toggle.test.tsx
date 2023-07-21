import React from 'react';
import { render, screen } from '@testing-library/react';

import { Chip } from '..';

describe('ToggleChip', () => {
  it('should render button as native element', () => {
    render(<Chip.Toggle>Norwegian</Chip.Toggle>);

    expect(screen.getByRole('button', { name: 'Norwegian' }));
  });

  it('should be possible to render as selected', () => {
    render(<Chip.Toggle selected>Norwegian</Chip.Toggle>);

    expect(screen.getByRole('button', { name: 'Norwegian' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
