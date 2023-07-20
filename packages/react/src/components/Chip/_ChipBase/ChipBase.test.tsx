import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChipBase, type ChipBaseProps } from './ChipBase';

const user = userEvent.setup();

const TestComponent = ({ ...rest }: ChipBaseProps): JSX.Element => {
  const [selected, setSelected] = useState(false);

  return (
    <ChipBase
      {...rest}
      selected={selected}
      onClick={() => setSelected(!selected)}
    >
      Nynorsk
    </ChipBase>
  );
};

describe('ChipButton', () => {
  it('should render as button by default', () => {
    render(<ChipBase>Button Text</ChipBase>);

    expect(screen.getByRole('button', { name: 'Button Text' }));
  });

  it('should support onClick by default', async () => {
    const handleOnClickMock = jest.fn();
    render(<ChipBase onClick={handleOnClickMock}>Button Text</ChipBase>);

    await user.click(screen.getByRole('button', { name: 'Button Text' }));
    expect(handleOnClickMock).toHaveBeenCalled();
  });

  it('should support polymorphism component', () => {
    render(
      <ChipBase
        as='a'
        href='#'
      >
        Link
      </ChipBase>,
    );

    expect(screen.getByRole('link', { name: 'Link' }));
  });

  it('should render a chip and not be pressed by default', () => {
    render(<ChipBase>Nynorsk</ChipBase>);

    expect(screen.getByRole('button', { name: 'Nynorsk' })).not.toHaveAttribute(
      'aria-pressed',
    );
  });

  it('should be marked as pressed when selected', () => {
    render(<ChipBase selected>Nynorsk</ChipBase>);

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

  it('rest props should be supported', () => {
    render(<ChipBase className='testClass'>Norwegian</ChipBase>);

    const chip = screen.getByRole('button', { name: 'Norwegian' });
    expect(chip).toHaveClass('testClass');

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});
