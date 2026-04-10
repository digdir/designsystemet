import { render, screen } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  test('has correct value and label', () => {
    const value = 'test';
    render(<Input value={value} />);
    expect(screen.getByDisplayValue(value)).toBeDefined();
  });

  it('Has type attribute set to "text" by default', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('Has given type attribute if set', () => {
    const type = 'tel';
    render(<Input type={type} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
  });
});
