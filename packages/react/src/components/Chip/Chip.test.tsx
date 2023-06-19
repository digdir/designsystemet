import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip } from './Chip';

const user = userEvent.setup();

const TestComponent = (): JSX.Element => {
  const [selected, setSelected] = useState(false);

  return (
    <Chip
      selected={selected}
      onClick={() => setSelected(!selected)}
    >
      Nynorsk
    </Chip>
  );
};

describe('Chip', () => {
  test('should render a chip and not be pressed by default', () => {
    render(<Chip>Nynorsk</Chip>);

    expect(screen.getByRole('button', { name: 'Nynorsk' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('should be marked as pressed when selected', () => {
    render(<Chip selected>Nynorsk</Chip>);

    expect(screen.getByRole('button', { name: 'Nynorsk' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('should toggle aria-pressed based on user interaction', async () => {
    render(<TestComponent />);
    const chip = screen.getByRole('button', { name: 'Nynorsk' });

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
