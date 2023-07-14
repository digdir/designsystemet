import React from 'react';
import { render, screen } from '@testing-library/react';

import { Chip } from '..';

describe('Chip.Group', () => {
  it('should be possible to render a group', () => {
    render(
      <Chip.Group>
        <Chip>First item</Chip>
        <Chip>Second item</Chip>
        <Chip>Third item</Chip>
      </Chip.Group>,
    );

    const [fistChip, secondChip, thirdChip] = screen.getAllByRole('listitem');
    expect(screen.getByRole('list'));
    expect(fistChip).toHaveTextContent('First item');
    expect(secondChip).toHaveTextContent('Second item');
    expect(thirdChip).toHaveTextContent('Third item');
  });
});
