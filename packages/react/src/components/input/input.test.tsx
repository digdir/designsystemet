import { render as renderRtl, screen } from '@testing-library/react';

import type { InputProps } from './Input';
import { Input } from './Input';

describe('Input', () => {
  test('has correct value and label', () => {
    render({ value: 'test' });
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  it('Has type attribute set to "text" by default', () => {
    render();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('Has given type attribute if set', () => {
    const type = 'tel';
    render({ type });
    expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
  });
});

const render = (props: Partial<InputProps> = {}) =>
  renderRtl(
    <Input
      {...{
        onChange: vi.fn(),
        ...props,
      }}
    />,
  );
