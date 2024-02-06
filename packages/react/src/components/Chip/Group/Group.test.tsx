import { render, screen } from '@testing-library/react';

import { Chip } from '..';

describe('Chip.Group', () => {
  it('should be possible to render a group', () => {
    render(
      <Chip.Group>
        <Chip.Toggle>First item</Chip.Toggle>
        <Chip.Toggle>Second item</Chip.Toggle>
        <Chip.Toggle>Third item</Chip.Toggle>
      </Chip.Group>,
    );

    const [fistChip, secondChip, thirdChip] = screen.getAllByRole('listitem');
    expect(screen.getByRole('list'));
    expect(fistChip).toHaveTextContent('First item');
    expect(secondChip).toHaveTextContent('Second item');
    expect(thirdChip).toHaveTextContent('Third item');
  });
});
