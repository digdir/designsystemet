import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip, type ToggleChipProps } from '..';

const user = userEvent.setup();

const TestComponent = ({ children, ...rest }: ToggleChipProps): JSX.Element => {
  const [selected, setSelected] = useState(false);

  return (
    <Chip.Toggle
      {...rest}
      selected={selected}
      onClick={() => setSelected(!selected)}
    >
      {children}
    </Chip.Toggle>
  );
};

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

  it('should toggle aria-pressed based on user interaction', async () => {
    render(<TestComponent>Norwegian</TestComponent>);
    const chip = screen.getByRole('button', { name: 'Norwegian' });

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('rest props should be supported', () => {
    render(<Chip.Toggle className='testClass'>Norwegian</Chip.Toggle>);

    const chip = screen.getByRole('button', { name: 'Norwegian' });
    expect(chip).toHaveClass('testClass');

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});
