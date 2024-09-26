import { render, screen } from '@testing-library/react';
import { Chip } from '..';

describe('Chip.Button', () => {
  it('should render button as native element', () => {
    render(<Chip.Button>Norwegian</Chip.Button>);
    const chip = screen.getByRole('button', { name: 'Norwegian' });

    expect(chip).toBeInTheDocument();
  });

  it('rest props should be supported', () => {
    render(<Chip.Button className='testClass'>Norwegian</Chip.Button>);

    const chip = screen.getByRole('button', { name: 'Norwegian' });
    expect(chip).toHaveClass('testClass');

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});

describe('Chip.Removable', () => {
  it('should render button as native element', () => {
    render(<Chip.Removable>Norwegian</Chip.Removable>);

    const chip = screen.getByRole('button', { name: 'Norwegian' });
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('data-removable');
  });

  it('rest props should be supported', () => {
    render(<Chip.Removable className='testClass'>Norwegian</Chip.Removable>);

    const chip = screen.getByRole('button', { name: 'Norwegian' });
    expect(chip).toHaveClass('testClass');

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});

describe('Chip.Checkbox', () => {
  it('should render label and input as native element', () => {
    render(<Chip.Checkbox>Norwegian</Chip.Checkbox>);

    const chip = screen.getByLabelText('Norwegian');
    const input = screen.getByRole('checkbox');
    expect(chip).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('rest props should be supported', () => {
    render(
      <Chip.Checkbox
        checked
        className='testClass'
        disabled
        name='language'
        value='norwegian'
      >
        Norwegian
      </Chip.Checkbox>,
    );

    const chip = screen.getByText('Norwegian', { selector: 'label' });
    const input = screen.getByRole('checkbox');
    expect(chip).toHaveClass('testClass');
    expect(input).toHaveAttribute('name', 'language');
    expect(input).toHaveAttribute('value', 'norwegian');
    expect(input).toBeChecked();
    expect(input).toBeDisabled();

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});

describe('Chip.Radio', () => {
  it('should render label and input as native element', () => {
    render(<Chip.Radio>Norwegian</Chip.Radio>);

    const chip = screen.getByLabelText('Norwegian');
    const input = screen.getByRole('radio');
    expect(chip).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('rest props should be supported', () => {
    render(
      <Chip.Radio
        checked
        className='testClass'
        disabled
        name='language'
        value='norwegian'
      >
        Norwegian
      </Chip.Radio>,
    );

    const chip = screen.getByText('Norwegian', { selector: 'label' });
    const input = screen.getByRole('radio');
    expect(chip).toHaveClass('testClass');
    expect(input).toHaveAttribute('name', 'language');
    expect(input).toHaveAttribute('value', 'norwegian');
    expect(input).toBeChecked();
    expect(input).toBeDisabled();

    // Ensure that the last class is the one added by rest-props.
    const lastClassNameIndex = chip.classList.length - 1;
    expect(chip.classList[lastClassNameIndex]).toBe('testClass');
  });
});
