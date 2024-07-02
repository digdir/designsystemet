import { useState, act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip, type RemovableChipProps } from '..';

const user = userEvent.setup();

const TestComponent = ({
  children,
  ...rest
}: RemovableChipProps): JSX.Element => {
  const [removed, setRemoved] = useState(false);

  return (
    <>
      {!removed && (
        <Chip.Removable
          {...rest}
          onClick={() => setRemoved(true)}
        >
          {children}
        </Chip.Removable>
      )}
    </>
  );
};

describe('RemovableChip', () => {
  it('should render button as native element', () => {
    render(<Chip.Removable>Norwegian</Chip.Removable>);

    expect(screen.getByRole('button', { name: 'Norwegian' }));
  });

  it('should be removed based on user interaction', async () => {
    render(<TestComponent>Norwegian</TestComponent>);
    const chip = screen.getByRole('button', { name: 'Norwegian' });

    expect(chip);
    await act(async () => await user.click(chip));
    expect(
      screen.queryByRole('button', { name: 'Norwegian' }),
    ).not.toBeInTheDocument();
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
