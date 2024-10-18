import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Input, Label } from '../..';
import { fieldObserver } from './fieldObserver';

describe('fieldObserver', () => {
  it('connects input and label', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Input />
      </div>,
    );
    fieldObserver(container);

    const label = screen.getByText('Navn');
    const input = screen.getByLabelText('Navn');

    expect(label).toHaveAttribute('for', input.id);
  });
});
