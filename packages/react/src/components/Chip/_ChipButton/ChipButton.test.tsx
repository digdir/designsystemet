import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChipButton } from './ChipButton';

const user = userEvent.setup();

const TestComponent = (): JSX.Element => {
  const [selected, setSelected] = useState(false);

  return (
    <ChipButton
      selected={selected}
      onClick={() => setSelected(!selected)}
    >
      Nynorsk
    </ChipButton>
  );
};

describe('ChipButton', () => {
  it('should render as button by default', () => {
    render(<ChipButton>Button Text</ChipButton>);

    expect(screen.getByRole('button', { name: 'Button Text' }));
  });

  it('should support onClick by default', async () => {
    const handleOnClickMock = jest.fn();
    render(<ChipButton onClick={handleOnClickMock}>Button Text</ChipButton>);

    await user.click(screen.getByRole('button', { name: 'Button Text' }));
    expect(handleOnClickMock).toHaveBeenCalled();
  });

  it('should render a chip and not be pressed by default', () => {
    render(<ChipButton>Nynorsk</ChipButton>);

    expect(screen.getByRole('button', { name: 'Nynorsk' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('should be marked as pressed when selected', () => {
    render(<ChipButton selected>Nynorsk</ChipButton>);

    expect(screen.getByRole('button', { name: 'Nynorsk' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('should toggle aria-pressed based on user interaction', async () => {
    render(<TestComponent />);
    const chip = screen.getByRole('button', { name: 'Nynorsk' });

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
