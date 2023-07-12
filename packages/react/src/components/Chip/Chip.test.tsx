import React from 'react';
import { render, screen } from '@testing-library/react';

import { Chip } from '.';

describe('Chip', () => {
  it('should render chip as anchor by default', () => {
    render(<Chip href='#'>Norwegian</Chip>);

    expect(screen.getByRole('link', { name: 'Norwegian' }));
  });

  it('should be possible to render a toggle chip', () => {
    render(<Chip.Toggle>Norwegian</Chip.Toggle>);

    expect(screen.getByRole('button', { name: 'Norwegian' }));
  });

  it('should render removable chip and aria-label should be supported', () => {
    render(<Chip.Removable aria-label='Slett nynorsk'>Nynorsk</Chip.Removable>);

    expect(screen.getByLabelText('Slett nynorsk')).toHaveClass('removable');
  });

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

  it('rest props should be supported', () => {
    render(
      <Chip
        href='#'
        className='testClass'
      >
        Norwegian
      </Chip>,
    );

    const chip = screen.getByRole('link', { name: 'Norwegian' });
    expect(chip).toHaveClass('testClass');

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});
