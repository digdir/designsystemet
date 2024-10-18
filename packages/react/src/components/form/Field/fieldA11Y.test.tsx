import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Input, Label } from '../../';
import { fieldA11Y } from './fieldA11Y';

describe('fieldA11Y', () => {
  it('connects input and label', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Input />
      </div>,
    );
    fieldA11Y(container);

    const label = screen.getByText('Navn');
    const input = screen.getByLabelText('Navn');

    expect(label).toHaveAttribute('for', input.id);
  });
});
